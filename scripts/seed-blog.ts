import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const blogCategories = [
    { name: "Sektörel Haberler", slug: "sektorel-haberler", order: 1 },
    { name: "Ürün İncelemeleri", slug: "urun-incelemeleri", order: 2 },
    { name: "Teknik Makaleler", slug: "teknik-makaleler", order: 3 },
    { name: "Başarı Hikayeleri", slug: "basari-hikayeleri", order: 4 },
    { name: "Duyurular", slug: "duyurular", order: 5 },
];

async function main() {
    console.log("Seeding blog categories...");

    for (const cat of blogCategories) {
        await prisma.blogCategory.upsert({
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

    console.log("Blog categories seeded successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
