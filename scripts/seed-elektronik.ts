
import { PrismaClient, AttributeType, FilterUiType } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting Elektronik Seeding...");

    // 1. Root Category: Elektronik
    const elektronikRoot = await prisma.category.upsert({
        where: { slug: "elektronik" },
        update: { isActive: true },
        create: {
            name: "Elektronik",
            slug: "elektronik",
            description: "Endüstriyel elektronik parçalar ve kontrol sistemleri",
            isActive: true,
            order: 1, // Sigma Profil was 0
            icon: "settings_input_component",
        },
    });

    // 2. Sub-categories
    const subCategories = [
        { name: "Güç Kaynakları ve Smps Çeşitleri", slug: "guc-kaynaklari-ve-smps-cesitleri" },
        { name: "Mach3 - Kontrol Paneli", slug: "mach3-kontrol-paneli" },
        { name: "Spindle Motor Ve Sürücüler", slug: "spindle-motor-ve-suruculer" },
        { name: "Step Motor | Sürücü", slug: "step-motor-surucu" },
        { name: "Servo Motor ve Sürücüleri", slug: "servo-motor-ve-suruculeri" },
        { name: "Hız Kontrol Cihazları", slug: "hiz-kontrol-cihazlari" },
        { name: "Vakum Pompası Çeşitleri", slug: "vakum-pompasi-cesitleri" },
        { name: "Makina Ekipmanları", slug: "makina-ekipmanlari" },
        { name: "Otomatik Yağlama Çeşitleri", slug: "otomatik-yaglama-cesitleri" },
        { name: "Sensör Ve Siviç Çeşitleri", slug: "sensor-ve-sivic-cesitleri" },
    ];

    for (let i = 0; i < subCategories.length; i++) {
        const sub = subCategories[i];
        await prisma.category.upsert({
            where: { slug: sub.slug },
            update: { parentId: elektronikRoot.id, order: i + 1 },
            create: {
                name: sub.name,
                slug: sub.slug,
                parentId: elektronikRoot.id,
                order: i + 1,
            },
        });
    }

    // 3. Brands
    const brands = [
        "Jss", "Promertech Teknoloji", "Kızak Yağlama", "GDZ MOTOR", "Mach3 El Çarkı",
        "Step Motor", "Endüktif Sensör", "Cnc Kontrol Ünitesi", "Step Motor Kablosu",
        "Takım Tutucu", "Diğer", "Pens Kapaklar", "Mach3 Kontrol Kartı", "Promertech",
        "Knife Handle High Speed Tool", "Knife", "Siemens Hız Kontrol Cihazı",
        "Arel Spindle Motor", "ER25 Pens", "Güç Kaynağı", "ER16 Pens", "ZJIVNV",
        "Hertz Spindle Motor", "ER20 Pens", "Cnc Kontrol Paneli", "Vakum Pompası",
        "RBCA", "Button", "Plastik Pano"
    ];

    for (let i = 0; i < brands.length; i++) {
        const brandName = brands[i];
        const slug = brandName.toLowerCase()
            .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
            .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
            .replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")
            .replace(/(^-|-$)/g, "");

        await prisma.brand.upsert({
            where: { slug },
            update: { order: i },
            create: { name: brandName, slug, order: i },
        });
    }

    // 4. Attribute Definitions + Options
    const attributeDefs = [
        {
            key: "model",
            label: "Model",
            type: AttributeType.ENUM,
            options: ["Model", "Cnc Router", "Elektronik Parçaları"]
        },
        {
            key: "step_motor_gucu",
            label: "Step Motor Gücü",
            type: AttributeType.ENUM,
            options: ["0.47 Nm", "1.5 Nm", "12 Nm", "2,2 Nm", "20 Nm", "28 Nm", "3 Nm", "4.5 Nm", "5 Nm", "6 Nm", "8.5 Nm"]
        },
        {
            key: "step_motor_flans_olcusu",
            label: "Step Motor Flanş Ölçüsü",
            type: AttributeType.ENUM,
            options: ["42x42 mm", "57x57 mm", "60x60 mm", "86x86 mm", "109,86 x 109,86 mm"]
        },
        {
            key: "nema_olcusu",
            label: "Nema Ölçüsü",
            type: AttributeType.ENUM,
            options: ["Nema 17", "Nema 23", "Nema 24", "Nema 34", "Nema 42"]
        },
        {
            key: "step_motor_adim_acisi",
            label: "Step Motor Adım Açısı",
            type: AttributeType.ENUM,
            options: ["1.8 derece"]
        },
        {
            key: "haberlesme_sistemi",
            label: "Haberleşme sistemi",
            type: AttributeType.ENUM,
            options: ["Usb"]
        },
        {
            key: "test2",
            label: "test2",
            type: AttributeType.ENUM,
            options: ["FİTRE 2-1"]
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

    // 5. Category Filters for Elektronik Root
    const elektronikFilters = [
        { builtinKey: "brand", uiType: FilterUiType.CHECKBOX, isSearchable: true },
        { attributeKey: "model", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "step_motor_gucu", uiType: FilterUiType.RADIO, isSearchable: true },
        { attributeKey: "step_motor_flans_olcusu", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "nema_olcusu", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "step_motor_adim_acisi", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "test2", uiType: FilterUiType.RADIO, isSearchable: false },
        { attributeKey: "haberlesme_sistemi", uiType: FilterUiType.RADIO, isSearchable: false },
        { builtinKey: "price", uiType: FilterUiType.RANGE, isSearchable: false },
    ];

    // No disruptive deletes

    for (let i = 0; i < elektronikFilters.length; i++) {
        const f = elektronikFilters[i];
        let attributeId = null;
        if (f.attributeKey) {
            const attr = await prisma.attributeDefinition.findUnique({ where: { key: f.attributeKey } });
            attributeId = attr?.id;
        }

        await prisma.categoryFilter.create({
            data: {
                categoryId: elektronikRoot.id,
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

    console.log("✅ Elektronik Seeding Complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
