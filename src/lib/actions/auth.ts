"use server";
import prisma from "@/lib/prisma";
import { hashSync } from "bcryptjs";
import { signIn, signOut } from "@/lib/auth";

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
