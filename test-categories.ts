import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const categories = await prisma.category.findMany({
        where: { parent: { slug: "sigma-profil" } },
        include: { _count: { select: { products: true } } }
    });
    for (const c of categories) {
        console.log(`${c.name}: ${c._count.products}`);
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
