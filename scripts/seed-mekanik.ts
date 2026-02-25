
import { PrismaClient, AttributeType, FilterUiType } from "@prisma/client";
const prisma = new PrismaClient();

function slugify(text: string) {
    return text.toLowerCase()
        .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
        .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

async function main() {
    console.log("🌱 Starting Mekanik Seeding...");

    // 1. Root Category: Mekanik
    const mekanikRoot = await prisma.category.upsert({
        where: { slug: "mekanik" },
        update: { isActive: true },
        create: {
            name: "Mekanik",
            slug: "mekanik",
            description: "Endüstriyel mekanik parçalar, dişliler ve raylar",
            isActive: true,
            order: 2, // Sigma Profil: 0, Elektronik: 1
            icon: "settings_suggest",
        },
    });

    // 2. Sub-categories
    const subCategories = [
        "Vidalı Mil Ve Somun Çeşitleri",
        "Kremayer Dişli Çeşitleri",
        "Planet Redüktör Çeşitleri",
        "Hareketli Kablo Kanalı",
        "Konik Kilit Çeşitleri",
        "Teknik El Aletleri Çeşitleri",
        "Torna Aynası Sanou",
        "Triger Dişli Kasnak",
        "Zincir Dişli"
    ];

    for (let i = 0; i < subCategories.length; i++) {
        const name = subCategories[i];
        const slug = slugify(name);
        await prisma.category.upsert({
            where: { slug },
            update: { parentId: mekanikRoot.id, order: i + 1 },
            create: {
                name,
                slug,
                parentId: mekanikRoot.id,
                order: i + 1,
            },
        });
    }

    // 3. Brands
    const brands = [
        "ZİNCİR DİŞLİ", "Mk Kasnak", "Promertech", "Kremayer Dişli Pinyon",
        "Hareketli Kablo Kanalı", "Kaplin", "SANOU", "Kremayer Dişli",
        "Bilyalı Somun", "Vidalı Mil", "Falcon Planet Redüktör",
        "ZD Planet Redüktör", "Somun Gövde", "Varvel Boşluksuz Redüktör",
        "Promertech Teknoloji"
    ];

    for (let i = 0; i < brands.length; i++) {
        const brandName = brands[i];
        const slug = slugify(brandName);
        await prisma.brand.upsert({
            where: { slug },
            update: { order: i },
            create: { name: brandName, slug, order: i },
        });
    }

    // 4. Attribute Definitions + Options
    const attributeDefs = [
        {
            key: "mekanik_model",
            label: "Model",
            type: AttributeType.ENUM,
            options: ["FB Serisi"]
        },
        {
            key: "mekanik_govde",
            label: "Gövde",
            type: AttributeType.ENUM,
            options: ["60 Gövde", "80 gövde", "90 Gövde", "120 Gövde", "40 G", "50 G"]
        },
        {
            key: "motor_yonu_yuzuk_capi",
            label: "Motor Yönü Yüzük Çapı",
            type: AttributeType.ENUM,
            options: ["8 mm", "14 mm", "19 mm", "19mm - Ops (12,7-14-16)", "22 mm"]
        },
        {
            key: "mekanik_marka",
            label: "Marka",
            type: AttributeType.ENUM,
            options: ["FALCON", "Gearbox", "SANOU", "ZD"]
        },
        {
            key: "kademe",
            label: "Kademe",
            type: AttributeType.ENUM,
            options: ["1/10", "1/5", "1/3"]
        },
        {
            key: "motor_uyumu",
            label: "Motor Uyumu",
            type: AttributeType.ENUM,
            options: ["6000 Rpm Kadar"]
        }
    ];

    for (const def of attributeDefs) {
        const attr = await prisma.attributeDefinition.upsert({
            where: { key: def.key },
            update: { label: def.label, type: def.type },
            create: { key: def.key, label: def.label, type: def.type },
        });

        for (let j = 0; j < def.options.length; j++) {
            await prisma.attributeOption.upsert({
                where: { attributeId_value: { attributeId: attr.id, value: def.options[j] } },
                update: { order: j },
                create: { attributeId: attr.id, value: def.options[j], order: j },
            });
        }
    }

    // 5. Category Filters for Mekanik Root
    const mekanikFilters = [
        { builtinKey: "brand", uiType: FilterUiType.CHECKBOX, isSearchable: true },
        { attributeKey: "mekanik_model", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "mekanik_govde", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "motor_yonu_yuzuk_capi", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "mekanik_marka", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "kademe", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "motor_uyumu", uiType: FilterUiType.RADIO, isSearchable: false },
        { builtinKey: "price", uiType: FilterUiType.RANGE, isSearchable: false },
    ];

    // No disruptive deletes

    for (let i = 0; i < mekanikFilters.length; i++) {
        const f = mekanikFilters[i];
        let attributeId = null;
        if (f.attributeKey) {
            const attr = await prisma.attributeDefinition.findUnique({ where: { key: f.attributeKey } });
            attributeId = attr?.id;
        }

        await prisma.categoryFilter.create({
            data: {
                categoryId: mekanikRoot.id,
                attributeId,
                builtinKey: f.builtinKey,
                uiType: f.uiType,
                isSearchable: f.isSearchable,
                order: i + 1,
                isVisible: true,
                isInherited: true,
            },
        });
    }

    console.log("✅ Mekanik Seeding Complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
