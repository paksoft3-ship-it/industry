import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── SITE SETTINGS ────────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteName: "CNC Otomasyon",
      siteDescription: "Endüstriyel Otomasyonda Güvenilir Çözüm Ortağınız",
      phone: "+90 212 555 00 00",
      whatsapp: "+90 555 555 55 55",
      email: "info@cncotomasyon.com",
      address: "İkitelli OSB Mah. Marmara Sanayi Sitesi M Blok No:12 Başakşehir / İstanbul",
      workingHours: "Pzt-Cum: 09:00 - 18:00",
      facebookUrl: "#",
      instagramUrl: "#",
      linkedinUrl: "#",
      youtubeUrl: "#",
      dosyaMerkeziSlug: "dosya-merkezi",
      defaultCurrency: "TRY",
      logoUrl: "/images/sivtech_makina_horizontal.png",
    },
  });
  console.log("  ✓ Site settings");

  // ─── ADMIN USER ───────────────────────────────────────
  await prisma.user.upsert({
    where: { email: "admin@cncotomasyon.com" },
    update: {},
    create: {
      email: "admin@cncotomasyon.com",
      passwordHash: hashSync("admin123", 12),
      firstName: "Admin",
      lastName: "CNC",
      role: "SUPER_ADMIN",
      emailVerified: true,
    },
  });
  console.log("  ✓ Admin user (admin@cncotomasyon.com / admin123)");

  /*
  // ─── L1 CATEGORIES ───────────────────────────────────
  ...
  // ─── AUDIT LOGS ──────────────────────────────────────
  ...
  */

  console.log("\n✅ Minimal Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
