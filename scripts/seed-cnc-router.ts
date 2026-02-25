
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
    console.log("🌱 Starting Cnc Router Makineleri Ve Parçaları Seeding...");

    // 1. Root Category
    const rootName = "Cnc Router Makineleri Ve Parçaları";
    const rootSlug = slugify(rootName);
    const rootCategory = await prisma.category.upsert({
        where: { slug: rootSlug },
        update: { isActive: true },
        create: {
            name: rootName,
            slug: rootSlug,
            description: "Cnc router makineleri, setleri, uçları ve yedek parçaları",
            isActive: true,
            order: 4, // Previous: Sigma(0), Elektronik(1), Mekanik(2), Lineer(3)
            icon: "precision_manufacturing",
        },
    });

    // 2. Sub-categories
    const subCategories = [
        "Büyük Cnc Router",
        "Cnc Router Ekonomik",
        "Mini Cnc Router",
        "4 Eksen Setleri",
        "Cnc Uç Çeşitleri",
        "Toz Emme Kafası",
        "Uç Soğutucu",
        "Z ekseni Modülleri"
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
        "Cnc Router", "Cnc Router Bıçakları", "Promertech", "Promertech Teknoloji",
        "Knife Handle High Speed Tool", "Uç Soğutucu", "Mach3 El Çarkı", "Mini Cnc", "Diğer"
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
            key: "cnc_model",
            label: "Model",
            type: AttributeType.ENUM,
            options: ["Kablosuz Kullanım"]
        },
        {
            key: "cnc_kontrol_sistemi",
            label: "Kontrol Sistemi",
            type: AttributeType.ENUM,
            options: ["NcStudio"]
        },
        {
            key: "cnc_isleme_boyu",
            label: "İşleme Boyu",
            type: AttributeType.ENUM,
            options: ["220"]
        },
        {
            key: "cnc_isleme_alani",
            label: "İşleme Alanı",
            type: AttributeType.ENUM,
            options: ["2100 mm x 3000 mm"]
        },
        {
            key: "cnc_tabla_olcusu",
            label: "Tabla Ölçüsü",
            type: AttributeType.ENUM,
            options: ["2100 mm x 3000 mm"]
        },
        {
            key: "cnc_makine_tipi",
            label: "Makine Tipi",
            type: AttributeType.ENUM,
            options: ["Cnc Router"]
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
        { attributeKey: "cnc_model", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "cnc_kontrol_sistemi", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "cnc_isleme_boyu", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "cnc_isleme_alani", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "cnc_tabla_olcusu", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "cnc_makine_tipi", uiType: FilterUiType.RADIO, isSearchable: false },
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

    console.log("✅ Cnc Router Makineleri Ve Parçaları Seeding Complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
