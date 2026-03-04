import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    // Check all tables with string fields that could contain this
    const tables = [
        { name: 'Category', model: prisma.category, fields: ['image', 'icon', 'description'] },
        { name: 'Product', model: prisma.product, fields: ['description'] },
        { name: 'ProductImage', model: prisma.productImage, fields: ['url'] },
        { name: 'Brand', model: prisma.brand, fields: ['logo', 'description'] },
        { name: 'Post', model: prisma.post, fields: ['image', 'content'] },
    ];

    for (const table of tables) {
        for (const field of table.fields) {
            const records = await (table.model as any).findMany({
                where: {
                    [field]: { contains: "mermak" }
                }
            });
            if (records.length > 0) {
                console.log(`Found "mermak" in ${table.name}.${field}`);
            }

            const records2 = await (table.model as any).findMany({
                where: {
                    [field]: { contains: "tcsofyaijmuc2sjz" }
                }
            });
            if (records2.length > 0) {
                console.log(`Found "tcsofyaijmuc2sjz" in ${table.name}.${field}`);
            }
        }
    }
}
main().finally(() => prisma.$disconnect());
