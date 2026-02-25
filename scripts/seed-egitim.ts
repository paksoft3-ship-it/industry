import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const educationCategories = [
    { name: "CNC Router Montajı", slug: "cnc-router-montaji", order: 1 },
    { name: "Step Motor Sürücü Ayarları", slug: "step-motor-surucu-ayarlari", order: 2 },
    { name: "Servo Motor Devreye Alma", slug: "servo-motor-devreye-alma", order: 3 },
    { name: "Mil Ayarları ve Kalibrasyon", slug: "mil-ayarlari-ve-kalibrasyon", order: 4 },
    { name: "Şase Statik Hesaplamaları", slug: "sase-statik-hesaplamalari", order: 5 },
    { name: "Spindle Motor Bakımı", slug: "spindle-motor-bakimi", order: 6 },
    { name: "Kontrol Kartı Bağlantıları", slug: "kontrol-karti-baglantilari", order: 7 },
    { name: "CAM Programlama Temelleri", slug: "cam-programlama-temelleri", order: 8 },
    { name: "G-Code Optimizasyonu", slug: "g-code-optimizasyonu", order: 9 },
    { name: "Malzeme Seçim Rehberi", slug: "malzeme-secim-rehberi", order: 10 },
    { name: "Kesici Takım Teorisi", slug: "kesici-takim-teorisi", order: 11 },
    { name: "CNC Sorun Giderme", slug: "cnc-sorun-giderme", order: 12 },
];

async function main() {
    console.log("Seeding education categories...");

    for (const cat of educationCategories) {
        await prisma.educationCategory.upsert({
            where: { slug: cat.slug },
            update: {
                name: cat.name,
                order: cat.order,
            },
            create: {
                name: cat.name,
                slug: cat.slug,
                order: cat.order,
            },
        });
    }

    console.log("Education categories seeded successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
