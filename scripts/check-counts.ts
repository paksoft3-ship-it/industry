import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const counts = {
        Category: await prisma.category.count(),
        Brand: await prisma.brand.count(),
        AttributeDefinition: await prisma.attributeDefinition.count(),
        CategoryFilter: await prisma.categoryFilter.count(),
        EducationCategory: await prisma.educationCategory.count(),
        BlogCategory: await prisma.blogCategory.count(),
    };

    console.log("DB COUNTS:", JSON.stringify(counts, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
