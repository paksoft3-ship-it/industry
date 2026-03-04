/**
 * Import Kızaklar Rulmanlar Vidalı Miller products from kazıklar.csv into the database.
 *
 * Usage:
 *   npx tsx scripts/import-kizaklar.ts              # live import
 *   npx tsx scripts/import-kizaklar.ts --dry-run    # preview only
 *
 * Prerequisites:
 *   Run seed-kizaklar-rulmanlar-vidali-miller.ts first to create categories and brands.
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
    // Must match the seed script's slugify exactly (no uppercase İ fix)
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

/** slugify with uppercase Turkish char fix — for brand/name classification only */
function slugifyFull(text: string): string {
    return text
        .replace(/İ/g, "i").replace(/Ğ/g, "g").replace(/Ü/g, "u")
        .replace(/Ş/g, "s").replace(/I/g, "i").replace(/Ö/g, "o").replace(/Ç/g, "c")
        .toLowerCase()
        .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
        .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
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

// ─── CSV Column Indices for kazıklar.csv ────────────────
// Header: "image-wrapper href","lazyloaded src","product-discount","d-flex href 2",
//         "col-12","col-12 href","col-12 2",
//         "product-price-not-discounted","product-price","w-100 href",
//         "d-none","lazyloading src","out-of-stock"
const COL = {
    SOURCE_URL: 0,
    IMAGE_1: 1,         // lazyloaded src
    DISCOUNT_PERCENT: 2,
    QUICK_VIEW: 3,
    BRAND_NAME: 4,
    BRAND_URL: 5,
    PRODUCT_NAME: 6,
    COMPARE_PRICE: 7,
    PRICE: 8,
    CART_URL: 9,
    CART_TEXT: 10,
    IMAGE_2: 11,        // lazyloading src
    OUT_OF_STOCK: 12,
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
// Subcategories (slugs from seed-kizaklar-rulmanlar-vidali-miller.ts):
//   lineer-kizaklar-ve-rulmanlari        → HG/RM rails, linear carriages, stoppers
//   alt-destekli-mil-ve-rulmanlari       → SBR round rails, SBR bearings, shaft supports (SHF/SK)
//   i-ndiksiyonlu-mil-ve-rulmanlari      → Krom Mil, İndiksiyonlu Krom Mil shafts
//   dokum-yataklar                       → UP pillow block bearings
//   lineer-rulman                        → LM/LME/LMEF/LMEK/SCE/TBR bearings
//   mafsal-kafa                          → Dana Gözü Mafsal
//   vidali-mil-uc-yataklari-cesitleri    → BF/BK/FF/FK end supports, Yataklı Rulman
//   motor-baglanti-setleri               → Step/servo motor brackets (Promertech Teknoloji, Jss)
//   rulmanlar                            → fallback for uncategorised bearings

function classifyProduct(name: string, brandName: string): string | null {
    const n = slugifyFull(name);
    const b = slugifyFull(brandName);

    // 1. Motor Bağlantı Setleri
    if (
        b === "promertech-teknoloji" ||
        b === "jss" ||
        n.includes("braket") ||
        n.includes("motor-baglanti") ||
        n.includes("baglanti-seti") ||
        n.includes("hm12") || n.includes("hm15")
    ) {
        return "motor-baglanti-setleri";
    }

    // 2. Mafsal Kafa
    if (b.includes("mafsal") || b.includes("dana-gozu") || n.includes("mafsal") || n.includes("dana-gozu")) {
        return "mafsal-kafa";
    }

    // 3. Vidalı Mil Uç Yatakları
    if (
        b === "vidali-mil-uc-yataklari" ||
        b === "yatakli-rulman" ||
        n.includes("vidali-mil-uc") ||
        n.includes("bf-") || n.includes("-bf-") ||
        n.includes("bk-") || n.includes("-bk-") ||
        n.includes("ff-") || n.includes("-ff-") ||
        n.includes("fk-") || n.includes("-fk-") ||
        n.includes("uc-yatagi") || n.includes("uc-yatak")
    ) {
        return "vidali-mil-uc-yataklari-cesitleri";
    }

    // 4. Döküm Yataklar (UP pillow blocks)
    if (b.includes("up-yatak") || n.includes("up-") || n.includes("dokum") || n.includes("yatakli-yatak")) {
        return "dokum-yataklar";
    }

    // 5. Lineer Rulman (LM/LME/LMEF/LMEK/SCE/TBR series)
    if (
        b.includes("lm-rulman") || b.includes("lme-rulman") || b.includes("lmef-rulman") ||
        b.includes("lmek-rulman") || b.includes("sce-rulman") || b.includes("tbr-rulman") ||
        n.includes("lineer-rulman") ||
        n.startsWith("lm-") || n.startsWith("lme-") || n.startsWith("lmef-") ||
        n.startsWith("lmek-") || n.startsWith("sce-") || n.startsWith("tbr-")
    ) {
        return "lineer-rulman";
    }

    // 6. Alt Destekli Mil (brand check first, before indiksiyonlu keyword)
    if (
        b === "alt-destekli-mil" || b.includes("sbr-rulman") ||
        b.includes("mil-tutucu") || b.includes("sk-mil-tutucu") ||
        n.includes("alt-destekli") ||
        n.includes("sbr-") || n.startsWith("sbr") ||
        n.includes("shf-") || n.startsWith("shf") ||
        (n.startsWith("sk-") && n.includes("mil-tutucu"))
    ) {
        return "alt-destekli-mil-ve-rulmanlari";
    }

    // 7. İndiksiyonlu Krom Mil shafts
    if (
        b === "indiksiyonlu-krom-mil" || b === "krom-mil" ||
        n.includes("krom-kapli") ||
        n.includes("indiksiyonlu") || n.includes("induksiyonlu") ||
        (n.includes("mil") && n.includes("krom"))
    ) {
        return "i-ndiksiyonlu-mil-ve-rulmanlari";
    }

    // 8. Lineer Kızaklar ve Arabalar (HG/RM/MGN rails & carriages, stoppers)
    if (
        b.includes("lineer-kizak") || b.includes("lineer-araba") ||
        b === "mka" || b === "knife" || b === "hg-knife" || b === "promertech" ||
        n.includes("lineer-ray") || n.includes("lineer-kizak") || n.includes("lineer-araba") ||
        n.includes("hg-") || n.includes("-hg-") || n.startsWith("hg") ||
        n.includes("hgw-") || n.includes("hgh-") ||
        n.includes("mgn-") || n.includes("rm-") ||
        n.includes("ray-stoperi") || n.includes("ray-baglanti")
    ) {
        return "lineer-kizaklar-ve-rulmanlari";
    }

    return null;
}

// ─── Main ───────────────────────────────────────────────

async function main() {
    console.log(`\n🚀 Kızaklar Product Import ${DRY_RUN ? "(DRY RUN)" : ""}\n`);

    // 1. Read CSV
    const csvPath = resolve(__dirname, "..", "kazıklar.csv");
    const raw = readFileSync(csvPath, "utf-8");
    const lines = raw.split("\n").map((l) => l.replace(/\r$/, "")).filter(Boolean);
    const dataLines = lines.slice(1);
    console.log(`📄 Found ${dataLines.length} rows in kazıklar.csv`);

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
            console.log(`    slug:        ${p.slug}`);
            console.log(`    price:       ${p.price} TRY`);
            console.log(`    brand:       ${p.brandName || "—"}`);
            console.log(`    subcategory: ${p.subCategorySlug || "(root only)"}`);
            console.log(`    image:       ${p.imageUrl ? "✓" : "✗"}`);
            console.log();
        }
        console.log(`\n🏁 DRY RUN complete. ${products.length} products would be imported.\n`);
        return;
    }

    // 3. Look up root category
    const rootCategory = await prisma.category.findUnique({ where: { slug: "kizaklar-rulmanlar-vidali-miller" } });
    if (!rootCategory) {
        throw new Error('Root category "kizaklar-rulmanlar-vidali-miller" not found! Run seed-kizaklar-rulmanlar-vidali-miller.ts first.');
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
        brandMap.set(slugifyFull(b.name), b.id);
    }

    // 6. Import products
    let created = 0;
    let updated = 0;
    let skipped = 0;

    const subCategoryFirstImage = new Map<string, string>();

    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const sku = `KIZ-${String(i + 1).padStart(4, "0")}`;

        const brandSlug = p.brandName ? slugify(p.brandName) : "";
        const brandSlugFull = p.brandName ? slugifyFull(p.brandName) : "";
        const brandId = brandSlug ? (brandMap.get(brandSlug) || brandMap.get(brandSlugFull) || null) : null;

        if (p.brandName && !brandId) {
            console.log(`   ⚠️  Brand not found: "${p.brandName}" (slug: ${brandSlug})`);
        }

        const subCategoryId = p.subCategorySlug ? subCategoryMap.get(p.subCategorySlug) || null : null;

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
                    const fallbackSku = `KIZ-${String(i + 1).padStart(4, "0")}-${Date.now() % 10000}`;
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

    // 7. Update subcategory images
    console.log("\n📸 Updating subcategory images for mega menu...");
    for (const [subSlug, imageUrl] of subCategoryFirstImage.entries()) {
        const subId = subCategoryMap.get(subSlug);
        if (subId) {
            await prisma.category.update({ where: { id: subId }, data: { image: imageUrl } });
            console.log(`   ✅ ${subSlug}`);
        }
    }

    console.log(`\n✨ Kızaklar Import Complete!`);
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
