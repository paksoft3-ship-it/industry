/**
 * Fix CategoryFilter records:
 * - Delete all existing filters (many may be duplicates or attribute filters with no data)
 * - Re-create only brand (CHECKBOX) + price (RANGE) for every root category
 *
 * Usage: npx tsx scripts/fix-category-filters.ts
 */

import { PrismaClient, FilterUiType } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    console.log("🔧 Fixing CategoryFilter records...\n");

    // Get all root categories (parentId = null)
    const rootCategories = await prisma.category.findMany({
        where: { parentId: null },
        orderBy: { order: "asc" },
        select: { id: true, name: true, slug: true },
    });

    console.log(`Found ${rootCategories.length} root categories:`);
    rootCategories.forEach(c => console.log(`  - ${c.name} (${c.slug})`));

    // Delete ALL existing filters for these categories
    const rootIds = rootCategories.map(c => c.id);
    const deleted = await prisma.categoryFilter.deleteMany({
        where: { categoryId: { in: rootIds } },
    });
    console.log(`\n🗑️  Deleted ${deleted.count} old CategoryFilter records`);

    // Re-create brand + price for each root category
    let created = 0;
    for (const cat of rootCategories) {
        await prisma.categoryFilter.createMany({
            data: [
                {
                    categoryId: cat.id,
                    builtinKey: "brand",
                    uiType: FilterUiType.CHECKBOX,
                    isSearchable: true,
                    order: 1,
                    isVisible: true,
                    isInherited: true,
                },
                {
                    categoryId: cat.id,
                    builtinKey: "price",
                    uiType: FilterUiType.RANGE,
                    isSearchable: false,
                    order: 2,
                    isVisible: true,
                    isInherited: false,
                },
            ],
        });
        created += 2;
        console.log(`  ✅ ${cat.name}`);
    }

    console.log(`\n✨ Done! Created ${created} filter records (brand + price per category)`);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
