
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
    console.log("🌱 Starting Kızaklar Rulmanlar Vidalı Miller Seeding...");

    // 1. Root Category
    const rootName = "Kızaklar Rulmanlar Vidalı Miller";
    const rootSlug = slugify(rootName);
    const rootCategory = await prisma.category.upsert({
        where: { slug: rootSlug },
        update: { isActive: true },
        create: {
            name: rootName,
            slug: rootSlug,
            description: "Lineer sistemler, raylar, arabalar ve rulman çeşitleri",
            isActive: true,
            order: 3, // Previous: Sigma(0), Elektronik(1), Mekanik(2)
            icon: "linear_scale",
        },
    });

    // 2. Sub-categories
    const subCategories = [
        "Lineer Kızaklar Ve Rulmanları",
        "Alt Destekli Mil Ve Rulmanları",
        "İndiksiyonlu Mil ve Rulmanları",
        "Döküm Yataklar",
        "Lineer Rulman",
        "Mafsal Kafa",
        "Vidalı Mil Uç Yatakları Çeşitleri",
        "Motor Bağlantı Setleri",
        "Rulmanlar"
    ];

    for (let i = 0; i < subCategories.length; i++) {
        const name = subCategories[i];
        const slug = slugify(name);
        await prisma.category.upsert({
            where: { slug },
            update: { parentId: rootCategory.id, order: i + 1 },
            create: {
                name,
                slug,
                parentId: rootCategory.id,
                order: i + 1,
            },
        });
    }

    // 3. Brands
    const brands = [
        "Promertech", "Mil Tutucu", "Hg Knife", "Tbr Rulman", "Sbr Rulman", "Krom Mil",
        "Knife", "Alt Destekli Mil", "Lineer Kızak-Ray", "Vidalı Mil Uç Yatakları",
        "Lineer Araba", "Lmek Rulman", "Mafsal Dana Gözü", "Up Yatak Rulman", "MKA",
        "Yataklı Rulman", "SK Mil Tutucu", "İndiksiyonlu Krom Mil", "Lm Rulman",
        "Lmef Rulman", "Sce Rulman", "Lme Rulman", "Promertech Teknoloji", "Jss"
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

    // 4. Attributes + Options
    const attributeDefs = [
        {
            key: "lineer_mil_cap_rulman_olcusu",
            label: "Mil Çap Rulman Ölçüsü",
            type: AttributeType.ENUM,
            options: ["30 mm", "40 mm", "15 mm", "16 mm", "20 mm", "25 mm", "8 mm", "10 mm", "12 mm", "50 mm", "17 mm"]
        },
        {
            key: "lineer_delik_merkezi_en_boy",
            label: "Delik Merkezi En x Boy",
            type: AttributeType.ENUM,
            options: ["26x26 mm", "32x36 mm", "35x35 mm", "38x30 mm", "53x40 mm", "57x45 mm", "72x52 mm", "82x62 mm", "100x80 mm"]
        },
        {
            key: "lineer_ray_dahil_yukseklik",
            label: "Ray Dahil Yükseklik",
            type: AttributeType.ENUM,
            options: ["24 mm", "28 mm", "30 mm", "36 mm", "40 mm", "42 mm", "48 mm", "60 mm"]
        },
        {
            key: "lineer_mil_capi",
            label: "Mil Çapı",
            type: AttributeType.ENUM,
            options: ["30 mm", "16 mm", "20 mm", "25 mm", "8 mm", "10 mm", "12 mm"]
        },
        {
            key: "lineer_kizak_ray_capi",
            label: "Kızak Ray Çapı",
            type: AttributeType.ENUM,
            options: ["15 mm", "20 mm", "35 mm"]
        },
        {
            key: "nema_olcusu", // ALREADY EXISTS
            label: "Nema Ölçüsü",
            type: AttributeType.ENUM,
            options: ["Nema 17"] // Will be merged in the loop below
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

    // 5. Category Filters for the Root
    const rootFilters = [
        { builtinKey: "brand", uiType: FilterUiType.CHECKBOX, isSearchable: true },
        { attributeKey: "lineer_mil_cap_rulman_olcusu", uiType: FilterUiType.RADIO, isSearchable: true },
        { attributeKey: "lineer_delik_merkezi_en_boy", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "lineer_ray_dahil_yukseklik", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "lineer_mil_capi", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "lineer_kizak_ray_capi", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "nema_olcusu", uiType: FilterUiType.RADIO, isSearchable: false },
        { builtinKey: "price", uiType: FilterUiType.RANGE, isSearchable: false },
    ];

    // No disruptive deletes

    for (let i = 0; i < rootFilters.length; i++) {
        const f = rootFilters[i];
        let attributeId = null;
        if (f.attributeKey) {
            const attr = await prisma.attributeDefinition.findUnique({ where: { key: f.attributeKey } });
            attributeId = attr?.id;
        }

        await prisma.categoryFilter.create({
            data: {
                categoryId: rootCategory.id,
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

    console.log("✅ Kızaklar Rulmanlar Vidalı Miller Seeding Complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
