import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("⚠️  Wiping database data...");

    const tablenames = await prisma.$queryRaw<
        Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    const tables = tablenames
        .map(({ tablename }) => tablename)
        .filter((name) => name !== "_prisma_migrations");

    try {
        for (const table of tables) {
            await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${table}" CASCADE;`);
        }
        console.log("✅ All tables truncated.");
    } catch (error) {
        console.error("❌ Error wiping database:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
