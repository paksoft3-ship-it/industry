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

export async function sendCustomerPasswordResetEmail(opts: {
  to: string;
  resetUrl: string;
}): Promise<void> {
  const { to, resetUrl } = opts;

  await sendMail({
    to,
    subject: "Şifre Sıfırlama",
    text: `Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın (1 saat geçerli):\n\n${resetUrl}\n\nBu isteği siz yapmadıysanız bu e-postayı yoksayabilirsiniz.`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;background:#f9fafb;border-radius:8px;">
        <h2 style="color:#111827;margin-bottom:8px;">Şifre Sıfırlama</h2>
        <p style="color:#4b5563;">Hesabınız için şifre sıfırlama isteği aldık. Aşağıdaki düğmeye tıklayarak yeni şifrenizi belirleyebilirsiniz.</p>
        <p style="color:#6b7280;font-size:13px;">Bu bağlantı <strong>1 saat</strong> boyunca geçerlidir.</p>
        <a href="${resetUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#0d59f2;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;">
          Şifreyi Sıfırla
        </a>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px;">Bu isteği siz yapmadıysanız bu e-postayı yoksayabilirsiniz.</p>
      </div>
    `,
  });
}

export async function sendQuoteEmail(opts: {
  to: string;
  orderNumber: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  quoteNote?: string;
  expiresAt?: Date;
}): Promise<void> {
  const fmt = (v: number) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(v);
  const expiry = opts.expiresAt ? opts.expiresAt.toLocaleDateString("tr-TR") : null;

  const rows = opts.items.map((i) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${i.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${i.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${fmt(i.price)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${fmt(i.price * i.quantity)}</td>
    </tr>`).join("");

  await sendMail({
    to: opts.to,
    subject: `Teklif #${opts.orderNumber}`,
    text: `Teklif numaranız: ${opts.orderNumber}\nToplam: ${fmt(opts.total)}${expiry ? `\nGeçerlilik: ${expiry}` : ""}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9fafb;border-radius:8px;">
        <h2 style="color:#111827;margin-bottom:4px;">Teklifiniz Hazır</h2>
        <p style="color:#6b7280;font-size:13px;">Teklif No: <strong>#${opts.orderNumber}</strong>${expiry ? ` &nbsp;|&nbsp; Geçerlilik: <strong>${expiry}</strong>` : ""}</p>
        ${opts.quoteNote ? `<div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:6px;padding:12px;margin:16px 0;color:#92400e;font-size:13px;">${opts.quoteNote}</div>` : ""}
        <table style="width:100%;border-collapse:collapse;margin-top:16px;background:#fff;border-radius:6px;overflow:hidden;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6b7280;">ÜRÜN</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;">ADET</th>
              <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6b7280;">BİRİM FİYAT</th>
              <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6b7280;">TOPLAM</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div style="margin-top:16px;text-align:right;font-size:13px;color:#4b5563;">
          ${opts.discount > 0 ? `<p>İndirim: <strong style="color:#dc2626;">-${fmt(opts.discount)}</strong></p>` : ""}
          <p>Kargo: <strong>${opts.shippingCost === 0 ? "Ücretsiz" : fmt(opts.shippingCost)}</strong></p>
          <p style="font-size:16px;color:#111827;">Genel Toplam: <strong style="color:#0d59f2;">${fmt(opts.total)}</strong></p>
        </div>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px;">Bu teklif tarafınıza bilgi amaçlı gönderilmiştir. Onay için lütfen bizimle iletişime geçin.</p>
      </div>
    `,
  });
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
