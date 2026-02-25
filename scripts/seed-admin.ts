
import { PrismaClient, UserRole } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding Admin User...");

    const email = "admin@example.com"; // User can change this later
    const password = "password123";      // User can change this later

    const admin = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            passwordHash: hashSync(password, 10),
            firstName: "Admin",
            lastName: "User",
            role: UserRole.SUPER_ADMIN,
        },
    });

    console.log(`✅ Admin user created: ${admin.email}`);
    console.log(`🔑 Initial Credentials:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`\n⚠️ Please log in with these credentials if your current session is invalid.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
