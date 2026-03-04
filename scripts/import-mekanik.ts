/**
 * Import Mekanik products from mekanik.csv into the database.
 *
 * Usage:
 *   npx tsx scripts/import-mekanik.ts              # live import
 *   npx tsx scripts/import-mekanik.ts --dry-run    # preview only
 *
 * Prerequisites:
 *   Run seed-mekanik.ts first to create categories and brands.
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
        .replace(/İ/g, "i").replace(/Ğ/g, "g").replace(/Ü/g, "u")
        .replace(/Ş/g, "s").replace(/I/g, "i").replace(/Ö/g, "o").replace(/Ç/g, "c")
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

// ─── CSV Column Indices for mekanik.csv ─────────────────
// Header: "image-wrapper href","product-discount","d-flex href 2",
//         "col-12","col-12 href","col-12 2",
//         "product-price-not-discounted","product-price","w-100 href",
//         "d-none","ls-is-cached src","lazyload src"
const COL = {
    SOURCE_URL: 0,      // product URL
    DISCOUNT_PERCENT: 1,
    QUICK_VIEW: 2,
    BRAND_NAME: 3,
    BRAND_URL: 4,
    PRODUCT_NAME: 5,
    COMPARE_PRICE: 6,
    PRICE: 7,
    CART_URL: 8,
    CART_TEXT: 9,
    IMAGE_1: 10,        // ls-is-cached src
    IMAGE_2: 11,        // lazyload src
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
// Subcategories:
//   vidali-mil-ve-somun-cesitleri  → Vidalı Mil, Bilyalı Somun, Somun Gövde
//   kremayer-disli-cesitleri       → Kremayer Dişli, Kremayer Dişli Pinyon
//   planet-reduktor-cesitleri      → Falcon/ZD/Varvel Redüktörler
//   hareketli-kablo-kanali         → Hareketli Kablo Kanalı brand + Promertech cable management
//   konik-kilit-cesitleri          → Kaplin (couplings)
//   teknik-el-aletleri-cesitleri   → Promertech Teknoloji (tools)
//   torna-aynasi-sanou             → SANOU
//   triger-disli-kasnak            → Mk Kasnak
//   zincir-disli                   → ZİNCİR DİŞLİ

function classifyProduct(name: string, brandName: string): string | null {
    // Use slugify for both to handle Turkish characters (İ→i, Ş→s, etc.) correctly
    const n = slugify(name);
    const bSlug = slugify(brandName);
    const b = brandName.toLowerCase().trim();

    // 1. Zincir Dişli
    if (bSlug === "zincir-disli" || bSlug.includes("zincir") || n.includes("zincir")) {
        return "zincir-disli";
    }

    // 2. Torna Aynası SANOU
    if (bSlug === "sanou" || n.includes("sanou") || n.includes("torna-aynasi")) {
        return "torna-aynasi-sanou";
    }

    // 3. Triger Dişli Kasnak
    if (bSlug === "mk-kasnak" || n.includes("kasnak") || n.includes("triger")) {
        return "triger-disli-kasnak";
    }

    // 4. Planet Redüktör
    if (
        bSlug.includes("planet-reduktor") ||
        bSlug.includes("reduktor") ||
        bSlug.includes("bosluksuz-reduktor") ||
        n.includes("reduktor") ||
        n.includes("gearbox")
    ) {
        return "planet-reduktor-cesitleri";
    }

    // 5. Kremayer Dişli
    if (
        bSlug.includes("kremayer") ||
        n.includes("kremayer") ||
        n.includes("pinyon")
    ) {
        return "kremayer-disli-cesitleri";
    }

    // 6. Vidalı Mil Ve Somun
    if (
        bSlug === "vidali-mil" ||
        bSlug === "bilyal-somun" || bSlug.includes("bilyal") ||
        bSlug === "somun-govde" ||
        n.includes("vidali-mil") ||
        n.includes("bilyal") ||
        n.includes("somun-govde") ||
        n.includes("ball-screw")
    ) {
        return "vidali-mil-ve-somun-cesitleri";
    }

    // 7. Konik Kilit / Kaplin
    if (
        bSlug === "kaplin" ||
        n.includes("kaplin") ||
        n.includes("konik-kilit") ||
        n.includes("gs14") || n.includes("gs19") || n.includes("gs24") ||
        n.includes("gs-09") || n.includes("gs-12") || n.includes("gs-14") ||
        n.includes("gs-19") || n.includes("gs-24") || n.includes("gs-28") ||
        n.includes("gs-38") || n.includes("gs-42") || n.includes("gs-48")
    ) {
        return "konik-kilit-cesitleri";
    }

    // 8. Teknik El Aletleri
    if (
        bSlug === "promertech-teknoloji" ||
        n.includes("raspa") ||
        n.includes("el-aleti") ||
        n.includes("capak-alma")
    ) {
        return "teknik-el-aletleri-cesitleri";
    }

    // 9. Hareketli Kablo Kanalı
    if (
        bSlug === "hareketli-kablo-kanali" ||
        bSlug === "promertech" ||
        n.includes("kablo-kanali")
    ) {
        return "hareketli-kablo-kanali";
    }

    return null; // root category only
}

// ─── Main ───────────────────────────────────────────────

async function main() {
    console.log(`\n🚀 Mekanik Product Import ${DRY_RUN ? "(DRY RUN)" : ""}\n`);

    // 1. Read CSV
    const csvPath = resolve(__dirname, "..", "mekanik.csv");
    const raw = readFileSync(csvPath, "utf-8");
    const lines = raw.split("\n").map((l) => l.replace(/\r$/, "")).filter(Boolean);
    const dataLines = lines.slice(1);
    console.log(`📄 Found ${dataLines.length} rows in mekanik.csv`);

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
        // No out-of-stock column in mekanik.csv, default to in-stock
        const inStock = true;

        products.push({
            name,
            slug,
            sourceUrl,
            imageUrl,
            brandName,
            price,
            compareAtPrice: compareAtPrice !== price ? compareAtPrice : null,
            discountPercent,
            inStock,
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
    const rootCategory = await prisma.category.findUnique({ where: { slug: "mekanik" } });
    if (!rootCategory) {
        throw new Error('Root category "mekanik" not found! Run seed-mekanik.ts first.');
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
        const sku = `MEK-${String(i + 1).padStart(4, "0")}`;

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
                    const fallbackSku = `MEK-${String(i + 1).padStart(4, "0")}-${Date.now() % 10000}`;
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

    console.log(`\n✨ Mekanik Import Complete!`);
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
