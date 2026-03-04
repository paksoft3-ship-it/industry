import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const prods = await prisma.productImage.findMany({
        where: { url: { contains: "mermak-cnc-tr-2" } }
    });
    console.log("Product images with mermak:", prods.map(p => p.url));

    const cats = await prisma.category.findMany({
        where: { image: { contains: "tcsofyaijmuc2sjz" } }
    });
    console.log("Categories with tcsofy:", cats.map(c => ({ slug: c.slug, image: c.image })));

    const brands = await prisma.brand.findMany({
        where: { logo: { contains: "tcsofyaijmuc2sjz" } }
    });
    console.log("Brands with tcsofy:", brands.map(c => ({ slug: c.slug, logo: c.logo })));
}
main().then(() => console.log('Done')).catch(console.error).finally(() => prisma.$disconnect());
