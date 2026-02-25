"use server";
import prisma from "@/lib/prisma";
import { hashSync } from "bcryptjs";
import { signIn, signOut } from "@/lib/auth";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/mailer";

// ── Simple in-memory rate limiter for forgot-password ──────────────────────
// key: email → { count, resetAt }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;        // max requests per window
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true; // allowed
  }
  if (entry.count >= RATE_LIMIT_MAX) return false; // blocked
  entry.count++;
  return true;
}
// ───────────────────────────────────────────────────────────────────────────

export async function registerUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new Error("Bu e-posta adresi zaten kayıtlı.");
  }

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: hashSync(data.password, 12),
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    },
  });

  return { id: user.id, email: user.email };
}

export async function loginUser(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Geçersiz e-posta veya şifre." };
  }
}

export async function logoutUser() {
  await signOut({ redirect: false });
}

// ── Forgot Password ────────────────────────────────────────────────────────
/**
 * Always returns a success-like message to avoid disclosing account existence.
 * Sends a reset link only if the email belongs to an admin user.
 */
export async function requestPasswordReset(
  email: string
): Promise<{ ok: true }> {
  const normalizedEmail = email.toLowerCase().trim();

  // Rate limit by email
  if (!checkRateLimit(normalizedEmail)) {
    // Still return ok to avoid leaking info, but don't proceed
    return { ok: true };
  }

  // Look up an admin/super-admin user (no error if not found)
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, role: true },
  });

  if (user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN")) {
    // Generate a cryptographically secure random token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // Expire any previous unused tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    // Store hashed token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.AUTH_URL ||
      "http://localhost:3000";
    const resetUrl = `${baseUrl}/admin/reset-password?token=${rawToken}`;

    await sendPasswordResetEmail({ to: normalizedEmail, resetUrl });
  }

  return { ok: true };
}

// ── Reset Password ─────────────────────────────────────────────────────────
export type ResetPasswordResult =
  | { ok: true }
  | { ok: false; error: string };

export async function resetPassword(
  rawToken: string,
  newPassword: string
): Promise<ResetPasswordResult> {
  if (!rawToken || !newPassword) {
    return { ok: false, error: "Geçersiz istek." };
  }

  if (newPassword.length < 8) {
    return { ok: false, error: "Şifre en az 8 karakter olmalıdır." };
  }

  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: { select: { id: true, role: true } } },
  });

  if (!tokenRecord) {
    return { ok: false, error: "Bağlantı geçersiz veya süresi dolmuş." };
  }

  if (tokenRecord.usedAt) {
    return { ok: false, error: "Bu bağlantı zaten kullanılmış." };
  }

  if (tokenRecord.expiresAt < new Date()) {
    return { ok: false, error: "Bağlantının süresi dolmuş. Lütfen yeniden isteyin." };
  }

  // Update password and mark token used in a transaction
  await prisma.$transaction([
    prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { passwordHash: hashSync(newPassword, 12) },
    }),
    prisma.passwordResetToken.update({
      where: { tokenHash },
      data: { usedAt: new Date() },
    }),
  ]);

  return { ok: true };
}
