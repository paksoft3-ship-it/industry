import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.siteSettings.update({
    where: { id: "default" },
    data: {
      phone: "+90 535 465 37 43",
      whatsapp: "+905354653743",
    },
  });
  console.log("✅ Phone updated to:", updated.phone);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
