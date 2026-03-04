/**
 * Import Elektronik products from elektronik.csv into the database.
 *
 * Usage:
 *   npx tsx scripts/import-elektronik.ts              # live import
 *   npx tsx scripts/import-elektronik.ts --dry-run    # preview only
 *
 * Prerequisites:
 *   Run seed-elektronik.ts first to create categories and brands.
 */

import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();
const DRY_RUN = process.argv.includes("--dry-run");

// ─── Helpers ────────────────────────────────────────────

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

/** Parse Turkish price format: "1.234,56" → 1234.56 */
function parseTurkishPrice(raw: string): number | null {
    if (!raw || raw.trim() === "") return null;
    const cleaned = raw.trim().replace(/\./g, "").replace(",", ".");
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
}

/** Parse a quoted CSV line, handling commas inside quotes. */
function parseCSVLine(line: string): string[] {
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === "," && !inQuotes) {
            fields.push(current);
            current = "";
        } else {
            current += ch;
        }
    }
    fields.push(current);
    return fields;
}

function extractSlugFromUrl(url: string): string {
    try {
        const segments = new URL(url).pathname.split("/").filter(Boolean);
        return segments[segments.length - 1] || "";
    } catch {
        const parts = url.split("/").filter(Boolean);
        return parts[parts.length - 1] || "";
    }
}

// ─── CSV Column Indices for elektronik.csv ─────────────
// Header: "image-wrapper href","ls-is-cached src","product-discount",
//         "d-flex href 2","col-12","col-12 href","col-12 2",
//         "product-price-not-discounted","product-price","w-100 href",
//         "d-none","lazyload src","lazyloaded src","out-of-stock"
const COL = {
    SOURCE_URL: 0,      // product URL
    IMAGE_1: 1,         // primary image
    DISCOUNT_PERCENT: 2,
    QUICK_VIEW: 3,
    BRAND_NAME: 4,
    BRAND_URL: 5,
    PRODUCT_NAME: 6,
    COMPARE_PRICE: 7,
    PRICE: 8,
    CART_URL: 9,
    CART_TEXT: 10,
    LAZYLOAD: 11,
    IMAGE_2: 12,        // fallback image
    OUT_OF_STOCK: 13,
} as const;

interface ParsedProduct {
    name: string;
    slug: string;
    sourceUrl: string;
    imageUrl: string;
    brandName: string;
    price: number;
    compareAtPrice: number | null;
    discountPercent: number;
    inStock: boolean;
    subCategorySlug: string | null;
}

// ─── Category Classification ─────────────────────────────
//
// Subcategories (slug → what products match):
//   guc-kaynaglari-ve-smps-cesitleri → SMPS, power supplies, toroid transformers
//   mach3-kontrol-paneli             → Mach3 cards, control panels, el çarkı, DSP, etc.
//   spindle-motor-ve-suruculer       → Spindle motors (Arel, Hertz, GDZ, Promertech) + RBCA inverters
//   step-motor-surucu                → Step motors (Jss/Nema), drivers, cables, brackets
//   servo-motor-ve-suruculeri        → Servo motor sets (Jss)
//   hiz-kontrol-cihazlari            → Siemens speed controllers
//   vakum-pompasi-cesitleri          → Vacuum blower pumps
//   makina-ekipmanlari               → Pens (ER collets), tool holders, buttons, switches, misc
//   otomatik-yaglama-cesitleri       → Auto lubrication systems
//   sensor-ve-sivic-cesitleri        → Proximity sensors and switches

function classifyProduct(name: string, brandName: string): string | null {
    const n = name.toLowerCase();
    const b = brandName.toLowerCase();

    // 1. Vakum Pompası
    if (
        b === "vakum pompası" ||
        n.includes("vakum pompası") ||
        (n.includes("blower") && (n.includes("vakum") || n.includes("pompa")))
    ) {
        return "vakum-pompasi-cesitleri";
    }

    // 2. Otomatik Yağlama
    if (
        b.includes("kızak yağlama") ||
        n.includes("yağlama") ||
        n.includes("yağ dağıtıcı")
    ) {
        return "otomatik-yaglama-cesitleri";
    }

    // 3. Sensör ve Siviç
    if (
        b.includes("endüktif sensör") ||
        b.includes("sensör") ||
        n.includes("sensör") ||
        n.includes("sensor")
    ) {
        return "sensor-ve-sivic-cesitleri";
    }

    // 4. Güç Kaynağı (check BEFORE step motor — "Step Motor Güç Kaynağı" must go here)
    if (
        b === "zjivnv" ||
        b === "güç kaynağı" ||
        n.includes("güç kaynağı") ||
        n.includes("smps") ||
        n.includes("toroid") ||
        (b.includes("promertech") && n.includes("trafo")) ||
        (b === "knife handle high speed tool" && n.includes("güç kaynağı"))
    ) {
        return "guc-kaynaklari-ve-smps-cesitleri";
    }

    // 5. Hız Kontrol Cihazları (Siemens VFDs + spindle driver under Siemens brand)
    if (
        b.includes("siemens hız kontrol") ||
        n.includes("hız kontrol cihazı")
    ) {
        return "hiz-kontrol-cihazlari";
    }

    // 6. Spindle Motor ve Sürücüler (check BEFORE step/servo to catch DC spindle under Cnc Kontrol Paneli)
    if (
        b.includes("spindle motor") ||
        b === "rbca" ||
        b === "gdz motor" ||
        (b === "promertech" && n.includes("spindle")) ||
        n.includes("spindle motor") ||
        n.includes("inverter") ||
        n.includes("motor sürücü") ||
        n.includes("firenleme direnci")
    ) {
        return "spindle-motor-ve-suruculer";
    }

    // 7. Servo Motor ve Sürücüleri
    if (n.includes("servo motor") || n.includes("servo")) {
        return "servo-motor-ve-suruculeri";
    }

    // 8. Step Motor | Sürücü
    if (
        b === "step motor" ||
        b === "step motor kablosu" ||
        n.includes("step motor") ||
        n.includes("nema 17") || n.includes("nema 23") || n.includes("nema 24") ||
        n.includes("nema 34") || n.includes("nema 42") ||
        n.includes("tb6600") ||
        n.includes("jss556") || n.includes("jss860") ||
        n.includes("cwd556") || n.includes("cwd860") ||
        n.includes("dm556") || n.includes("dm860") ||
        n.includes("mks osc") ||
        n.includes("ttr kablo") ||
        n.includes("motor tutucu braket") ||
        n.includes("flanş braket") || n.includes("flans braket") ||
        n.includes("bağlantı sacı nema") ||
        n.includes("bağlantı seti bk")
    ) {
        return "step-motor-surucu";
    }

    // 9. Mach3 / Kontrol Paneli
    if (
        b === "mach3 kontrol kartı" ||
        b === "mach3 el çarkı" ||
        b === "cnc kontrol paneli" ||
        b === "cnc kontrol ünitesi" ||
        n.includes("mach3") ||
        n.includes("kontrol kartı") ||
        n.includes("kontrol ünitesi") ||
        n.includes("kontrol paneli") ||
        n.includes("el çarkı") ||
        n.includes("dsp kontrol") ||
        n.includes("smc4") || n.includes("smc5") ||
        n.includes("adt-cnc") ||
        n.includes("ddcs") ||
        n.includes("lpt kablosu") ||
        n.includes("akz 250") || n.includes("akz250") ||
        n.includes("hm12-") || n.includes("hm15-") || n.includes("hm-15-") ||
        n.includes("cnc freze kontrol") ||
        n.includes("cnc torna kontrol") ||
        n.includes("ölçüm probu") ||
        n.includes("takım yükseklik") ||
        n.includes("kompakt flash") || n.includes("cf kart") ||
        n.includes("fanuc") ||
        n.includes("tc55h")
    ) {
        return "mach3-kontrol-paneli";
    }

    // 10. Makina Ekipmanları (pens/collets, tool holders, buttons, switches, misc)
    if (
        b === "er16 pens" || b === "er20 pens" || b === "er25 pens" ||
        b === "knife" || b === "knife handle high speed tool" ||
        b === "takım tutucu" || b === "pens kapaklar" ||
        b === "button" || b === "plastik pano" || b === "diğer" ||
        n.includes("pens") ||
        n.includes("takım tutucu") ||
        n.includes("bt30") || n.includes("bt40") ||
        n.includes("hsk") ||
        n.includes("iso30") || n.includes("iso 30") ||
        n.includes("ay anahtarı") ||
        n.includes("klemens") ||
        n.includes("röle") || n.includes("relay")
    ) {
        return "makina-ekipmanlari";
    }

    return null; // root category only
}

// ─── Main ───────────────────────────────────────────────

async function main() {
    console.log(`\n🚀 Elektronik Product Import ${DRY_RUN ? "(DRY RUN)" : ""}\n`);

    // 1. Read CSV
    const csvPath = resolve(__dirname, "..", "elektronik.csv");
    const raw = readFileSync(csvPath, "utf-8");
    const lines = raw.split("\n").map((l) => l.replace(/\r$/, "")).filter(Boolean);
    const dataLines = lines.slice(1);
    console.log(`📄 Found ${dataLines.length} rows in elektronik.csv`);

    // 2. Parse all rows
    const products: ParsedProduct[] = [];
    const errors: { row: number; reason: string }[] = [];

    for (let i = 0; i < dataLines.length; i++) {
        const fields = parseCSVLine(dataLines[i]);
        const rowNum = i + 2;

        const name = fields[COL.PRODUCT_NAME]?.trim();
        const sourceUrl = fields[COL.SOURCE_URL]?.trim();
        const priceRaw = fields[COL.PRICE]?.trim();

        if (!name) { errors.push({ row: rowNum, reason: "Missing product name" }); continue; }
        if (!sourceUrl) { errors.push({ row: rowNum, reason: "Missing source URL" }); continue; }

        const price = parseTurkishPrice(priceRaw);
        if (price === null || price <= 0) {
            errors.push({ row: rowNum, reason: `Invalid price: "${priceRaw}"` });
            continue;
        }

        const img1 = fields[COL.IMAGE_1]?.trim() || "";
        const img2 = fields[COL.IMAGE_2]?.trim() || "";
        const imageUrl = img1 || img2;

        const slug = extractSlugFromUrl(sourceUrl);
        if (!slug) { errors.push({ row: rowNum, reason: "Could not extract slug from URL" }); continue; }

        const compareAtPrice = parseTurkishPrice(fields[COL.COMPARE_PRICE]?.trim());
        const discountPercent = parseInt(fields[COL.DISCOUNT_PERCENT]?.trim() || "0", 10) || 0;
        const brandName = fields[COL.BRAND_NAME]?.trim() || "";
        const outOfStock = fields[COL.OUT_OF_STOCK]?.trim() || "";

        products.push({
            name,
            slug,
            sourceUrl,
            imageUrl,
            brandName,
            price,
            compareAtPrice: compareAtPrice !== price ? compareAtPrice : null,
            discountPercent,
            inStock: !outOfStock,
            subCategorySlug: classifyProduct(name, brandName),
        });
    }

    console.log(`✅ Parsed ${products.length} valid products`);
    if (errors.length > 0) {
        console.log(`⚠️  ${errors.length} rows skipped:`);
        for (const err of errors) console.log(`   Row ${err.row}: ${err.reason}`);
    }

    if (DRY_RUN) {
        console.log("\n--- DRY RUN: Category distribution ---\n");
        const catCounts: Record<string, number> = {};
        for (const p of products) {
            const key = p.subCategorySlug || "(root only — no sub)";
            catCounts[key] = (catCounts[key] || 0) + 1;
        }
        for (const [cat, count] of Object.entries(catCounts).sort()) {
            console.log(`  ${cat}: ${count}`);
        }
        console.log("\n--- Sample of first 5 products ---\n");
        for (const p of products.slice(0, 5)) {
            console.log(`  ${p.name}`);
            console.log(`    slug:     ${p.slug}`);
            console.log(`    price:    ${p.price} TRY`);
            console.log(`    brand:    ${p.brandName || "—"}`);
            console.log(`    subcategory: ${p.subCategorySlug || "(root only)"}`);
            console.log(`    image:    ${p.imageUrl ? "✓" : "✗"}`);
            console.log();
        }
        console.log(`\n🏁 DRY RUN complete. ${products.length} products would be imported.\n`);
        return;
    }

    // 3. Look up root category
    const rootCategory = await prisma.category.findUnique({ where: { slug: "elektronik" } });
    if (!rootCategory) {
        throw new Error('Root category "elektronik" not found! Run seed-elektronik.ts first.');
    }
    console.log(`📂 Root category: ${rootCategory.name} (${rootCategory.id})`);

    // 4. Build subcategory map
    const allSubcategories = await prisma.category.findMany({ where: { parentId: rootCategory.id } });
    const subCategoryMap = new Map<string, string>();
    for (const sub of allSubcategories) {
        subCategoryMap.set(sub.slug, sub.id);
    }
    console.log(`📂 Found ${allSubcategories.length} subcategories`);

    // 5. Build brand map
    const allBrands = await prisma.brand.findMany();
    const brandMap = new Map<string, string>();
    for (const b of allBrands) {
        brandMap.set(b.slug, b.id);
        brandMap.set(slugify(b.name), b.id);
    }

    // 6. Import products
    let created = 0;
    let updated = 0;
    let skipped = 0;

    // Track first image per subcategory for mega menu cards
    const subCategoryFirstImage = new Map<string, string>();

    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const sku = `EL-${String(i + 1).padStart(4, "0")}`;

        const brandSlug = p.brandName ? slugify(p.brandName) : "";
        const brandId = brandSlug ? brandMap.get(brandSlug) || null : null;

        if (p.brandName && !brandId) {
            console.log(`   ⚠️  Brand not found: "${p.brandName}" (slug: ${brandSlug})`);
        }

        const subCategoryId = p.subCategorySlug ? subCategoryMap.get(p.subCategorySlug) || null : null;

        // Collect first image for each subcategory (used for mega menu cards)
        if (p.subCategorySlug && p.imageUrl && !subCategoryFirstImage.has(p.subCategorySlug)) {
            subCategoryFirstImage.set(p.subCategorySlug, p.imageUrl);
        }

        const assignCategories = async (prodId: string) => {
            await prisma.productCategory.deleteMany({ where: { productId: prodId } });
            await prisma.productCategory.create({ data: { productId: prodId, categoryId: rootCategory.id } });
            if (subCategoryId) {
                await prisma.productCategory.create({ data: { productId: prodId, categoryId: subCategoryId } });
            }
        };

        try {
            const existing = await prisma.product.findUnique({ where: { slug: p.slug } });

            if (existing) {
                await prisma.product.update({
                    where: { slug: p.slug },
                    data: {
                        name: p.name,
                        price: p.price,
                        compareAtPrice: p.compareAtPrice,
                        currency: "TRY",
                        brandId,
                        inStock: p.inStock,
                        badge: p.discountPercent > 0 ? `%${p.discountPercent}` : null,
                        isActive: true,
                    },
                });
                await assignCategories(existing.id);
                updated++;
            } else {
                const product = await prisma.product.create({
                    data: {
                        name: p.name,
                        slug: p.slug,
                        sku,
                        price: p.price,
                        compareAtPrice: p.compareAtPrice,
                        currency: "TRY",
                        brandId,
                        inStock: p.inStock,
                        badge: p.discountPercent > 0 ? `%${p.discountPercent}` : null,
                        isActive: true,
                    },
                });

                if (p.imageUrl) {
                    await prisma.productImage.create({
                        data: { productId: product.id, url: p.imageUrl, alt: p.name, order: 0 },
                    });
                }

                await assignCategories(product.id);
                created++;
            }

            if ((i + 1) % 50 === 0) {
                console.log(`   ... processed ${i + 1}/${products.length}`);
            }
        } catch (err: any) {
            if (err.code === "P2002" && err.meta?.target?.includes("sku")) {
                try {
                    const fallbackSku = `EL-${String(i + 1).padStart(4, "0")}-${Date.now() % 10000}`;
                    const product = await prisma.product.create({
                        data: {
                            name: p.name, slug: p.slug, sku: fallbackSku,
                            price: p.price, compareAtPrice: p.compareAtPrice, currency: "TRY",
                            brandId, inStock: p.inStock,
                            badge: p.discountPercent > 0 ? `%${p.discountPercent}` : null,
                            isActive: true,
                        },
                    });
                    if (p.imageUrl) {
                        await prisma.productImage.create({
                            data: { productId: product.id, url: p.imageUrl, alt: p.name, order: 0 },
                        });
                    }
                    await assignCategories(product.id);
                    created++;
                } catch (innerErr: any) {
                    console.error(`   ❌ Failed to create "${p.name}": ${innerErr.message}`);
                    skipped++;
                }
            } else {
                console.error(`   ❌ Failed to create/update "${p.name}": ${err.message}`);
                skipped++;
            }
        }
    }

    // 7. Update subcategory images for mega menu cards
    console.log("\n📸 Updating subcategory images for mega menu...");
    for (const [subSlug, imageUrl] of subCategoryFirstImage.entries()) {
        const subId = subCategoryMap.get(subSlug);
        if (subId) {
            await prisma.category.update({
                where: { id: subId },
                data: { image: imageUrl },
            });
            console.log(`   ✅ ${subSlug}`);
        }
    }

    console.log(`\n✨ Elektronik Import Complete!`);
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total:   ${products.length}\n`);
}

main()
    .catch((e) => {
        console.error("❌ Import error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
