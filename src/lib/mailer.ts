/**
 * Mailer utility
 *
 * TODO: Install and configure Resend (https://resend.com) to send real emails.
 *       1. npm install resend
 *       2. Add RESEND_API_KEY to .env.local
 *       3. Replace the console.log block below with the Resend implementation.
 *
 * For now, all emails are logged to the console so the reset link is visible
 * during development / testing.
 */

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendMail(opts: MailOptions): Promise<void> {
  // ── Resend (uncomment when configured) ──────────────────────────────────
  // const { Resend } = await import("resend");
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: "noreply@yourdomain.com",
  //   to: opts.to,
  //   subject: opts.subject,
  //   html: opts.html,
  //   text: opts.text,
  // });
  // ────────────────────────────────────────────────────────────────────────

  // Console logger fallback
  console.log("─────────────── [MAILER] ───────────────");
  console.log(`To     : ${opts.to}`);
  console.log(`Subject: ${opts.subject}`);
  if (opts.text) console.log(`Body   :\n${opts.text}`);
  console.log("────────────────────────────────────────");
}

export async function sendPasswordResetEmail(opts: {
  to: string;
  resetUrl: string;
}): Promise<void> {
  const { to, resetUrl } = opts;

  await sendMail({
    to,
    subject: "Admin Şifre Sıfırlama",
    text: `Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın (1 saat geçerli):\n\n${resetUrl}\n\nBu isteği siz yapmadıysanız bu e-postayı yoksayabilirsiniz.`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;background:#f9fafb;border-radius:8px;">
        <h2 style="color:#111827;margin-bottom:8px;">Şifre Sıfırlama</h2>
        <p style="color:#4b5563;">Yönetici paneliniz için şifre sıfırlama isteği aldık. Aşağıdaki düğmeye tıklayarak yeni şifrenizi belirleyebilirsiniz.</p>
        <p style="color:#6b7280;font-size:13px;">Bu bağlantı <strong>1 saat</strong> boyunca geçerlidir.</p>
        <a href="${resetUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#0d59f2;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;">
          Şifreyi Sıfırla
        </a>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px;">Bu isteği siz yapmadıysanız bu e-postayı yoksayabilirsiniz.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin-top:24px;" />
        <p style="color:#9ca3af;font-size:11px;">Yönetici Paneli — Otomatik gönderim</p>
      </div>
    `,
  });
}
