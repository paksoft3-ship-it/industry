import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    console.log("Starting image fixes...");

    // 1. Delete broken mermak images
    const deletedImages = await prisma.productImage.deleteMany({
        where: { url: { contains: "mermak-cnc-tr-2" } }
    });
    console.log(`Deleted ${deletedImages.count} broken product images.`);

    // 2. Set subcategory images for Sigma Profil using siteData.ts placeholders
    const subcats = [
        { slug: "aluminyum-profiller", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGlotBZFRqNDD0_n5PhgKPq5ya4qVGN9ouPj5OeQlq0oDYKREwAMvTOf5RsIZCbtDcCeWEHXhIEvXCnq8K34rAY0A2QKCq5f-5ljE6s_pDOJDP1QWLH8ZBaHTeHWMYWGhGXYC_Wzc95fC8zRcyaRbspzAYyKb7e3aK9oauwS4gDxIJ2NBZeK_qslJpSlGZb2J8ZKIWo9XkKksjj94Fq9RStEv6NW2VyuOaDRjbaOnkCbYD46KT520jLXsNTMOjd3pcbHe5ojoIPFIB" },
        { slug: "kose-baglanti-cesitleri", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiyJGxlBxRSFMgG3OxKbKWrraTxuR1fFrkv9jho-uMMEuiqDVPw9MTvQYi_OqpBNU3hz9QzbFyZZlYmtfnDIn6O_L2ybG8vsT1guhjqf_uBJmJPoWN8gvQyOqy4A6kcBSR9RQNH8J6JK648yIGXP4O3ESYo1nU3ui07mErfObSJ23hJP4ACLH6iUuaQdr47exwSdV0I-XhHV-P4QG11FI3o8LnrnEyzUj6syeoUEY3dRZqP89M7xYMht3_Q-M5x0Z3A7luduI9Y9-p" },
        { slug: "kanal-somun-cesitleri", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3MWdP7npbt_DrEKnF3uqbrLzvAaJDNobPaVg8Igop6ka_RReHBVEgrbzzdlm4aaX-qT6cg8CPhc3-qKVw3bsm4wCh4ZCS6uBTvFrmnpgIrwmdnSe2yM40hf5QOvZ3FCeMzSW1WxETDbf6SGqMUuCWD2J2_W0qwxAz4hrX3t7Z7dV6r8d_5auMFIrAQyQSC0xpDABspvw61lwEsaNaJTJVc41xQKiRHsZskCx1wrwF9OLS39oJrksUsA1vito3U3Ft61Yb_L70o-ka" },
        { slug: "sigma-baglanti-saclari", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA27pjk2rZjaOaBp9HvF0EAOm0WlTIHGV30CFinXKw9i4j1kPCNfePfGjeYqzgdCUB0WPak5mqigDv6I6meaYJjpHLqsjnHjL9HQ4rwCp8ke24mNTSV0Cvqx9btl4JSMMwLsx7FlKfBnpeTOtnTPE7VyMJXOS8Y4BMKkbIhYumZ53tgG4JdIBd3vgkRLBTB2pure3EL_d-P0RhuApafaann-Lc7dYkSZxVces0PrOt3SfevG0de3yE9yS2lIuVEhVxZVybIwY5F9r8" },
        { slug: "baglanti-aksesuarlari", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCW9O0teyXG98QCqPA4GbdzPeL9IIkxLwEGTzhY2o5RdOtG_6_atPiai9ZTUidj9PV5_HdXhX33HbOjpu5OYacsP4mRhNinuUFNZyA_IKLyStckPdClpNT5RvPK4t0-Bis_eg2YQ21aWwfUuZclqQy3fMAhn-J0ei35bWo7QKaptx2Ps0sbcr0o4dyVkibZTXGdw7oVzR3YfqCsNDstmS9Njn13c0dc5RN_ST_xAjBm-8JqNf9jgRAIvgt18tfLY6viUQORhCC1ig1e" },
        { slug: "civata-cesitleri-metrik", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjYYL-ucytbVuGW5nxU4yFgbFwcBmO3VWSiMbsTqmQx7bdv1ngMZeTWzixIVfkU0o_vcl7Qf_fbJ3PEv545o9aWLeCGzOQIZL94XHe3ORaSgEmmCuLvxP7zVd_KMLVpzXxyHT3BKZX08ThsG1OoRgWeV2qNpvzzrb4gJV1qQ7KTD-Su_-86V53CQjC1TJMnjJH-BPFSUppHU9zK1zx00y7_YTF0PLurMw1XFrpdoG9PqSZDQ3_wQ9bUVAXAyNg7DRD0aEOMdkWobGA" },
        { slug: "makine-aksesuarlari", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXc_W37XnQn_JbzIfMBrnRuU4swtOyomCMZ96_nawJmgULB_4iVfQL43uXkpyrQ_4OoZ3v11C2dAoe_yYZ6JsFEpYCVDlzr93CH_VYy7PMoyEADtW_AoZjML6KazvjGDGlaTZOXDmkebVJ-PH3fuYzDZQnac5j7y49OZThxW0CQDMf6hiuUP7ErhZMXEYXBzpCMogtxOmrTwm6k6aCJe4EQoq3S_t11rKzsXGd503S0envzC8w4QoOcwRoA5o7B0LPZjjBS6kHJ8ji" }
    ];

    let updatedCats = 0;
    for (const cat of subcats) {
        try {
            await prisma.category.update({
                where: { slug: cat.slug },
                data: { image: cat.image }
            });
            updatedCats++;
        } catch (e) {
            console.log(`Failed to update ${cat.slug}: ${e.message}`);
        }
    }
    console.log(`Updated images for ${updatedCats} categories.`);
}

main().then(() => console.log('Done')).catch(console.error).finally(() => prisma.$disconnect());
