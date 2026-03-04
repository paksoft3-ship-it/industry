/**
 * Import Sigma Profil products from sigmaprofil.csv into the database.
 *
 * Usage:
 *   npx tsx scripts/import-sigma-profil.ts              # live import
 *   npx tsx scripts/import-sigma-profil.ts --dry-run    # preview only
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
                i++; // skip escaped quote
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

/** Extract slug from a URL like https://www.cnc-marketi.com/urun/20x20-sigma-profil-6-kanal */
function extractSlugFromUrl(url: string): string {
    try {
        const segments = new URL(url).pathname.split("/").filter(Boolean);
        // last segment is the slug
        return segments[segments.length - 1] || "";
    } catch {
        // fallback: extract last path segment manually
        const parts = url.split("/").filter(Boolean);
        return parts[parts.length - 1] || "";
    }
}

// ─── CSV Column Indices for sigmaprofil.csv ─────────────
// Header: "image-wrapper href","ls-is-cached src","discounted-badge","product-discount",
//         "d-flex href 2","col-12","col-12 href","col-12 2","mr-1",
//         "product-price-not-discounted","product-price","w-100 href","d-none",
//         "lazyloaded src","out-of-stock"
const COL = {
    SOURCE_URL: 0,        // image-wrapper href  → product URL
    IMAGE_1: 1,           // ls-is-cached src    → primary image (may be empty)
    DISCOUNT_BADGE: 2,    // discounted-badge    → "%"
    DISCOUNT_PERCENT: 3,  // product-discount    → e.g. "45"
    QUICK_VIEW: 4,        // d-flex href 2       → internal link (ignored)
    BRAND_NAME: 5,        // col-12              → brand name
    BRAND_URL: 6,         // col-12 href         → brand page URL (ignored)
    PRODUCT_NAME: 7,      // col-12 2            → product name
    CURRENCY: 8,          // mr-1                → "TL"
    COMPARE_PRICE: 9,     // product-price-not-discounted → original price
    PRICE: 10,            // product-price       → sale price
    CART_URL: 11,         // w-100 href          → add-to-cart link (ignored)
    CART_TEXT: 12,         // d-none              → "Sepete Ekle" (ignored)
    IMAGE_2: 13,          // lazyloaded src      → fallback image (may be empty)
    OUT_OF_STOCK: 14,     // out-of-stock        → "Çok Yakında Stoklarda" or ""
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
    currency: string;
    inStock: boolean;
}

// ─── Main ───────────────────────────────────────────────

async function main() {
    console.log(`\n🚀 Sigma Profil Product Import ${DRY_RUN ? "(DRY RUN)" : ""}\n`);

    // 1. Read CSV
    const csvPath = resolve(__dirname, "..", "sigmaprofil.csv");
    const raw = readFileSync(csvPath, "utf-8");
    const lines = raw.split("\n").map((l) => l.replace(/\r$/, "")).filter(Boolean);

    // Skip header
    const dataLines = lines.slice(1);
    console.log(`📄 Found ${dataLines.length} rows in sigmaprofil.csv`);

    // 2. Parse all rows
    const products: ParsedProduct[] = [];
    const errors: { row: number; reason: string }[] = [];

    for (let i = 0; i < dataLines.length; i++) {
        const fields = parseCSVLine(dataLines[i]);
        const rowNum = i + 2; // 1-indexed, after header

        const name = fields[COL.PRODUCT_NAME]?.trim();
        const sourceUrl = fields[COL.SOURCE_URL]?.trim();
        const priceRaw = fields[COL.PRICE]?.trim();

        // Validate required fields
        if (!name) {
            errors.push({ row: rowNum, reason: "Missing product name" });
            continue;
        }
        if (!sourceUrl) {
            errors.push({ row: rowNum, reason: "Missing source URL" });
            continue;
        }

        const price = parseTurkishPrice(priceRaw);
        if (price === null || price <= 0) {
            errors.push({ row: rowNum, reason: `Invalid price: "${priceRaw}"` });
            continue;
        }

        // Image: prefer ls-is-cached src, fallback to lazyloaded src
        const img1 = fields[COL.IMAGE_1]?.trim() || "";
        const img2 = fields[COL.IMAGE_2]?.trim() || "";
        const imageUrl = img1 || img2;

        const slug = extractSlugFromUrl(sourceUrl);
        if (!slug) {
            errors.push({ row: rowNum, reason: "Could not extract slug from URL" });
            continue;
        }

        const comparePriceRaw = fields[COL.COMPARE_PRICE]?.trim();
        const compareAtPrice = parseTurkishPrice(comparePriceRaw);
        const discountRaw = fields[COL.DISCOUNT_PERCENT]?.trim();
        const discountPercent = parseInt(discountRaw || "0", 10) || 0;
        const brandName = fields[COL.BRAND_NAME]?.trim() || "";
        const currency = fields[COL.CURRENCY]?.trim() || "TRY";
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
            currency: currency === "TL" ? "TRY" : currency,
            inStock: !outOfStock,
        });
    }

    console.log(`✅ Parsed ${products.length} valid products`);
    if (errors.length > 0) {
        console.log(`⚠️  ${errors.length} rows skipped:`);
        for (const err of errors) {
            console.log(`   Row ${err.row}: ${err.reason}`);
        }
    }

    if (DRY_RUN) {
        console.log("\n--- DRY RUN: Sample of first 5 products ---\n");
        for (const p of products.slice(0, 5)) {
            console.log(`  ${p.name}`);
            console.log(`    slug: ${p.slug}`);
            console.log(`    price: ${p.price} ${p.currency}`);
            console.log(`    compareAt: ${p.compareAtPrice ?? "—"}`);
            console.log(`    discount: ${p.discountPercent}%`);
            console.log(`    brand: ${p.brandName || "—"}`);
            console.log(`    image: ${p.imageUrl ? "✓" : "✗"}`);
            console.log(`    inStock: ${p.inStock}`);
            console.log();
        }
        console.log(`\n🏁 DRY RUN complete. ${products.length} products would be imported.\n`);
        return;
    }

    // 3. Look up root category
    const rootCategory = await prisma.category.findUnique({
        where: { slug: "sigma-profil" },
    });
    if (!rootCategory) {
        throw new Error(
            'Root category "sigma-profil" not found! Run seed-sigma-profil.ts first.'
        );
    }
    console.log(`📂 Root category: ${rootCategory.name} (${rootCategory.id})`);

    // 3.5 Look up subcategories
    const allSubcategories = await prisma.category.findMany({
        where: { parentId: rootCategory.id }
    });
    const subCategoryMap = new Map<string, string>();
    for (const sub of allSubcategories) {
        subCategoryMap.set(sub.slug, sub.id);
    }

    // 4. Load all brands into a lookup map (slugified name → id)
    const allBrands = await prisma.brand.findMany();
    const brandMap = new Map<string, string>();
    for (const b of allBrands) {
        brandMap.set(b.slug, b.id);
        // Also map the original name lowercased for flexible matching
        brandMap.set(slugify(b.name), b.id);
    }

    // 5. Import products
    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const sku = `SP-${String(i + 1).padStart(4, "0")}`;

        // Resolve brand
        const brandSlug = p.brandName ? slugify(p.brandName) : "";
        const brandId = brandSlug ? brandMap.get(brandSlug) || null : null;

        if (p.brandName && !brandId) {
            console.log(`   ⚠️  Brand not found: "${p.brandName}" (slug: ${brandSlug}) — skipping brandId`);
        }

        // --- Subcategory Classification ---
        const nameLower = p.name.toLowerCase();
        const brandNameLower = p.brandName.toLowerCase();
        let subCategoryId = null;

        if (brandNameLower.includes("köşe bağlantı") || nameLower.includes("köşe bağlantı") || nameLower.includes("kose baglanti")) {
            subCategoryId = subCategoryMap.get("kose-baglanti-cesitleri");
        } else if (brandNameLower.includes("somun") || nameLower.includes("somun")) {
            subCategoryId = subCategoryMap.get("kanal-somun-cesitleri");
        } else if (brandNameLower.includes("sacı") || nameLower.includes("sac") || nameLower.includes("sacı")) {
            subCategoryId = subCategoryMap.get("sigma-baglanti-saclari");
        } else if (brandNameLower.includes("civata") || nameLower.includes("civata") || brandNameLower.includes("cıvata")) {
            subCategoryId = subCategoryMap.get("civata-cesitleri-metrik");
        } else if (
            ["tampon", "takoz", "ayak", "kol", "bakalit", "topuz", "menteşe", "kilit", "kulp"]
                .some(k => brandNameLower.includes(k) || nameLower.includes(k))
        ) {
            subCategoryId = subCategoryMap.get("makine-aksesuarlari");
        } else if (
            brandNameLower.includes("elemanları") || brandNameLower.includes("ekipmanları") ||
            brandNameLower.includes("kapağı") || nameLower.includes("kapak") || nameLower.includes("kapağı") ||
            brandNameLower === "sigma profil bağlantı" || nameLower.includes("bağlantı")
        ) {
            subCategoryId = subCategoryMap.get("baglanti-aksesuarlari");
        } else if (nameLower.includes("profil") && nameLower.includes("kanal")) {
            subCategoryId = subCategoryMap.get("aluminyum-profiller");
        } else if (brandNameLower.includes("perakende") || brandNameLower.includes("toptan")) {
            subCategoryId = subCategoryMap.get("aluminyum-profiller");
        }
        if (!subCategoryId && nameLower.match(/\d+x\d+/)) {
            subCategoryId = subCategoryMap.get("aluminyum-profiller");
        }

        const assignCategories = async (prodId: string) => {
            await prisma.productCategory.deleteMany({ where: { productId: prodId } });
            await prisma.productCategory.create({ data: { productId: prodId, categoryId: rootCategory.id } });
            if (subCategoryId) {
                await prisma.productCategory.create({ data: { productId: prodId, categoryId: subCategoryId } });
            }
        };

        try {
            // Check if product with this slug already exists
            const existing = await prisma.product.findUnique({
                where: { slug: p.slug },
            });

            if (existing) {
                // Update existing product
                await prisma.product.update({
                    where: { slug: p.slug },
                    data: {
                        name: p.name,
                        price: p.price,
                        compareAtPrice: p.compareAtPrice,
                        currency: p.currency,
                        brandId,
                        inStock: p.inStock,
                        badge: p.discountPercent > 0 ? `%${p.discountPercent}` : null,
                        isActive: true,
                    },
                });
                await assignCategories(existing.id);
                updated++;
            } else {
                // Create new product
                const product = await prisma.product.create({
                    data: {
                        name: p.name,
                        slug: p.slug,
                        sku,
                        price: p.price,
                        compareAtPrice: p.compareAtPrice,
                        currency: p.currency,
                        brandId,
                        inStock: p.inStock,
                        badge: p.discountPercent > 0 ? `%${p.discountPercent}` : null,
                        isActive: true,
                    },
                });

                // Create product image if available
                if (p.imageUrl) {
                    await prisma.productImage.create({
                        data: {
                            productId: product.id,
                            url: p.imageUrl,
                            alt: p.name,
                            order: 0,
                        },
                    });
                }

                await assignCategories(product.id);

                created++;
            }

            // Progress every 50 products
            if ((i + 1) % 50 === 0) {
                console.log(`   ... processed ${i + 1}/${products.length}`);
            }
        } catch (err: any) {
            // Handle SKU uniqueness collision
            if (err.code === "P2002" && err.meta?.target?.includes("sku")) {
                console.log(`   ⚠️  SKU collision for "${p.name}" — trying with suffix`);
                try {
                    const fallbackSku = `SP-${String(i + 1).padStart(4, "0")}-${Date.now() % 10000}`;
                    const product = await prisma.product.create({
                        data: {
                            name: p.name,
                            slug: p.slug,
                            sku: fallbackSku,
                            price: p.price,
                            compareAtPrice: p.compareAtPrice,
                            currency: p.currency,
                            brandId,
                            inStock: p.inStock,
                            badge: p.discountPercent > 0 ? `%${p.discountPercent}` : null,
                            isActive: true,
                        },
                    });

                    if (p.imageUrl) {
                        await prisma.productImage.create({
                            data: {
                                productId: product.id,
                                url: p.imageUrl,
                                alt: p.name,
                                order: 0,
                            },
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

    console.log(`\n✨ Sigma Profil Import Complete!`);
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
