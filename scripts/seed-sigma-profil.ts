
import { PrismaClient, AttributeType, FilterUiType } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting Sigma Profil Seeding...");

    // 1. Root Category: Sigma Profil
    const sigmaProfilRoot = await prisma.category.upsert({
        where: { slug: "sigma-profil" },
        update: { isActive: true, order: 0 },
        create: {
            name: "Sigma Profil",
            slug: "sigma-profil",
            description: "Endüstriyel yapısal çerçeve sistemleri",
            isActive: true,
            order: 0,
            icon: "view_in_ar",
        },
    });

    // 2. Sub-categories
    const subCategories = [
        { name: "Alüminyum Profiller", slug: "aluminyum-profiller" },
        { name: "Köşe Bağlantı Çeşitleri", slug: "kose-baglanti-cesitleri" },
        { name: "Kanal Somun Çeşitleri", slug: "kanal-somun-cesitleri" },
        { name: "Sigma Bağlantı Sacları", slug: "sigma-baglanti-saclari" },
        { name: "Bağlantı Aksesuarları", slug: "baglanti-aksesuarlari" },
        { name: "Civata Çeşitleri Metrik", slug: "civata-cesitleri-metrik" },
        { name: "Makine Aksesuarları", slug: "makine-aksesuarlari" },
    ];

    for (let i = 0; i < subCategories.length; i++) {
        const sub = subCategories[i];
        await prisma.category.upsert({
            where: { slug: sub.slug },
            update: { parentId: sigmaProfilRoot.id, order: i },
            create: {
                name: sub.name,
                slug: sub.slug,
                parentId: sigmaProfilRoot.id,
                order: i,
            },
        });
    }

    // 3. Brands
    const brands = [
        "İmbus Civata", "Sustalı Kol", "Lineer Kızak-Ray", "Pens Kapaklar", "Sigma Profil Kilit",
        "Plastik Kulp", "Cnc Router", "Jss", "Kilit", "Menteşe", "Sigma Profil Bağlantı Ekipmanları",
        "Plastik Ayak", "Mafsallı Metal Oynar Ayak", "Bakalit Topuz", "Sigma Profil Bağlantı",
        "Sigma Profil Bağlantı Elemanları", "Somun Çeşitleri", "Diğer", "Bombe Başlı Civata",
        "Promertech", "Oynar Ayak Mafsallı", "Havşa Başlı Civata", "Probotsan Cnc Makine A.ş",
        "Kauçuk Takoz", "Sigma Profil Bağlantı Sacı", "Sigma Kapağı", "Bakalit", "Sigma Profil Perakende",
        "Sigma Profil Köşe Bağlantı", "Sigma Profil Toptan", "Tezgah Tamponu", "Knife Handle High Speed Tool"
    ];

    for (let i = 0; i < brands.length; i++) {
        const brandName = brands[i];
        const slug = brandName.toLowerCase()
            .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
            .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
            .replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");

        await prisma.brand.upsert({
            where: { slug },
            update: { order: i },
            create: { name: brandName, slug, order: i },
        });
    }

    // 4. Attribute Definitions
    const attributeDefs = [
        {
            key: "metre_agirligi",
            label: "Metre Ağırlığı",
            type: AttributeType.ENUM,
            options: [
                "2,33 Kg/Metre", "2,204 Kg/Metre", "2,482 Kg/Metre", "2,491 Kg/Metre", "2,76 Kg/Metre",
                "3,193 Kg/Metre", "3,389 Kg/Metre", "4,13 Kg/Metre", "4,81 Kg/Metre", "6,367 Kg/Metre",
                "2,07 Kg/Metre", "5,700", "2,863 Kg/Metre", "4,859 Kg/Metre", "3,863 Kg/Metre",
                "9,261 Kg/Metre", "10,236 Kg/Metre", "7,269 Kg/Metre", "5,294 Kg/Metre", "5,861 Kg/Metre",
                "1,21 Kg/Metre", "0,434 Kg/Metre", "0,593 Kg/Metre", "0,714 Kg/Metre", "0,734 Kg/Metre",
                "0,87 Kg/Metre", "0,897 Kg/Metre", "0,997 Kg/Metre", "1,169 Kg/Metre", "1,174 Kg/Metre",
                "0,402 Kg/Metre", "1,398 Kg/Metre", "1,555 Kg/Metre", "1,65 Kg/Metre", "1,71 Kg/Metre",
                "1,76 Kg/Metre", "1,832 Kg/Metre", "1,95 Kg/Metre", "1,957 Kg/Metre"
            ]
        },
        {
            key: "ebat",
            label: "Ebat",
            type: AttributeType.ENUM,
            options: [
                "230x290", "20x28", "55x45", "180x180", "30x45", "220x220", "42x42 mm", "311x311",
                "250x250", "240x240", "110x110", "200x250", "200x200", "160x220", "170x130",
                "130x130", "120x160", "120x130", "120x120", "110x150"
            ]
        },
        {
            key: "agirlik",
            label: "Ağırlık",
            type: AttributeType.ENUM,
            options: [
                "170x130", "10.5 Gr", "109.5 Gr", "114 Gr", "1180 Gr", "12 Gr", "136 Gr", "142 Gr",
                "1782 Gr", "2078 Gr", "248 Gr", "2739 Gr", "330 Gr", "9 Gr", "900 Gr", "990 Gr"
            ]
        },
        {
            key: "max_boy_olcusu",
            label: "Max Boy Ölçüsü",
            type: AttributeType.ENUM,
            options: ["6 Metre"]
        },
        {
            key: "isil_islem",
            label: "Isıl İşlem",
            type: AttributeType.ENUM,
            options: ["Isıl İşlemli"]
        },
        {
            key: "nema_olcusu",
            label: "Nema Ölçüsü",
            type: AttributeType.ENUM,
            options: ["Nema 34"]
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

    // 5. Category Filters for Sigma Profil
    const sigmaFilters = [
        { builtinKey: "brand", uiType: FilterUiType.CHECKBOX, isSearchable: true },
        { attributeKey: "metre_agirligi", uiType: FilterUiType.CHECKBOX, isSearchable: true },
        { attributeKey: "ebat", uiType: FilterUiType.CHECKBOX, isSearchable: true },
        { attributeKey: "agirlik", uiType: FilterUiType.CHECKBOX, isSearchable: true },
        { attributeKey: "max_boy_olcusu", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "isil_islem", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "nema_olcusu", uiType: FilterUiType.RADIO, isSearchable: false },
        { builtinKey: "price", uiType: FilterUiType.RANGE, isSearchable: false },
    ];

    // No disruptive deletes

    for (let i = 0; i < sigmaFilters.length; i++) {
        const f = sigmaFilters[i];
        let attributeId = null;
        if (f.attributeKey) {
            const attr = await prisma.attributeDefinition.findUnique({ where: { key: f.attributeKey } });
            attributeId = attr?.id;
        }

        await prisma.categoryFilter.create({
            data: {
                categoryId: sigmaProfilRoot.id,
                attributeId,
                builtinKey: f.builtinKey,
                uiType: f.uiType,
                isSearchable: f.isSearchable,
                order: i,
                isVisible: true,
                isInherited: true,
            },
        });
    }

    console.log("✅ Sigma Profil Seeding Complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
