/**
 * Import CNC Router products from router.csv into the database.
 *
 * Usage:
 *   npx tsx scripts/import-cnc-router.ts              # live import
 *   npx tsx scripts/import-cnc-router.ts --dry-run    # preview only
 *
 * Prerequisites:
 *   Run seed-cnc-router.ts first to create categories and brands.
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
        .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
        .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

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

function parseTurkishPrice(raw: string): number | null {
    if (!raw || raw.trim() === "") return null;
    const cleaned = raw.trim().replace(/\./g, "").replace(",", ".");
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
}

function parseCSVLine(line: string): string[] {
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            if (inQuotes && i + 1 < line.length && line[i + 1] === '"') { current += '"'; i++; }
            else inQuotes = !inQuotes;
        } else if (ch === "," && !inQuotes) {
            fields.push(current); current = "";
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

// ─── CSV Column Indices for router.csv ─────────────────
// Same layout as kazıklar.csv
const COL = {
    SOURCE_URL: 0,
    IMAGE_1: 1,
    DISCOUNT_PERCENT: 2,
    QUICK_VIEW: 3,
    BRAND_NAME: 4,
    BRAND_URL: 5,
    PRODUCT_NAME: 6,
    COMPARE_PRICE: 7,
    PRICE: 8,
    CART_URL: 9,
    CART_TEXT: 10,
    IMAGE_2: 11,
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
// Subcategories (slugs from seed-cnc-router.ts):
//   buyuk-cnc-router      → Large professional machines (≥1300mm table)
//   cnc-router-ekonomik   → Mid-range and ekonomik machines
//   mini-cnc-router       → Mini/desktop CNC machines
//   4-eksen-setleri       → 4-axis rotary sets, divisor heads
//   cnc-uc-cesitleri      → Router bits, freze uçları, drill sets
//   toz-emme-kafasi       → Dust collection heads/brushes
//   uc-sogutucu           → Coolant nozzles
//   z-ekseni-modulleri    → Z-axis modules

function classifyProduct(name: string, brandName: string): string | null {
    const n = slugifyFull(name);
    const b = slugifyFull(brandName);

    // 1. Uç Soğutucu
    if (b === "uc-sogutucu" || n.includes("sogutuc") || n.includes("nozul") || n.includes("kikirdak-hortum")) {
        return "uc-sogutucu";
    }

    // 2. Toz Emme Kafası
    if (b.includes("toz-emme") || n.includes("toz-emme") || n.includes("toz-emme-baslig") || n.includes("toz-emme-fircas")) {
        return "toz-emme-kafasi";
    }

    // 3. Z Ekseni Modülleri
    if (n.includes("z-eksen") || n.includes("z-ekseni") || n.includes("kare-kizak-modulu")) {
        return "z-ekseni-modulleri";
    }

    // 4. 4 Eksen Setleri (rotary axis, divisor heads, lathe sets)
    if (
        b === "knife-handle-high-speed-tool" ||
        n.includes("4-eksen") || n.includes("divizor") ||
        n.includes("doner-eksen") || n.includes("karsi-punta") || n.includes("karsit-punta") ||
        n.includes("torna-seti") || n.includes("sabit-punta")
    ) {
        return "4-eksen-setleri";
    }

    // 5. CNC Uç Çeşitleri (router bits, end mills, drill sets)
    if (
        b === "cnc-router-bicaklari" ||
        n.includes("bicak") || n.includes("freze-cnc") || n.includes("cnc-uc") ||
        n.includes("karbur") || n.includes("parmak-freze") || n.includes("gravur") ||
        n.includes("pcb-bicak") || n.includes("engraving") || n.includes("kompozit-derz") ||
        n.includes("jilet-arden") || n.includes("matkap-ucu") || n.includes("kilavuz") ||
        n.includes("isleme-karbur") || n.includes("karbur-freze")
    ) {
        return "cnc-uc-cesitleri";
    }

    // 6. Mini CNC Router
    if (b === "mini-cnc" || n.includes("mini-cnc") || n.includes("t-rex") || n.includes("mini-cnc-router")) {
        return "mini-cnc-router";
    }

    // 7. Büyük CNC Router (large professional machines by table dimensions)
    if (
        n.includes("profesyonel-cnc") ||
        n.includes("4000x") || n.includes("5000x") || n.includes("6000x") ||
        n.includes("3000x") || n.includes("2500x") || n.includes("2100x") ||
        n.includes("1600x1100") || n.includes("1300x2500") || n.includes("kare-kizak") ||
        (b === "promertech-teknoloji" && n.includes("cnc-router"))
    ) {
        return "buyuk-cnc-router";
    }

    // 8. CNC Router Ekonomik (mid/entry-range machines)
    if (
        b === "cnc-router" ||
        (b === "promertech" && n.includes("cnc-router")) ||
        n.includes("ekonomik-cnc") || n.includes("1500x800") || n.includes("860x780") ||
        n.includes("1200x800")
    ) {
        return "cnc-router-ekonomik";
    }

    return null;
}

// ─── Main ───────────────────────────────────────────────

async function main() {
    console.log(`\n🚀 CNC Router Product Import ${DRY_RUN ? "(DRY RUN)" : ""}\n`);

    const csvPath = resolve(__dirname, "..", "router.csv");
    const raw = readFileSync(csvPath, "utf-8");
    const lines = raw.split("\n").map((l) => l.replace(/\r$/, "")).filter(Boolean);
    const dataLines = lines.slice(1);
    console.log(`📄 Found ${dataLines.length} rows in router.csv`);

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
        console.log("\n--- All products ---\n");
        for (const p of products) {
            console.log(`  [${p.subCategorySlug || "ROOT"}] ${p.name.substring(0, 60)}`);
        }
        console.log(`\n🏁 DRY RUN complete. ${products.length} products would be imported.\n`);
        return;
    }

    const rootCategory = await prisma.category.findUnique({ where: { slug: "cnc-router-makineleri-ve-parcalari" } });
    if (!rootCategory) {
        throw new Error('Root category "cnc-router-makineleri-ve-parcalari" not found! Run seed-cnc-router.ts first.');
    }
    console.log(`📂 Root category: ${rootCategory.name} (${rootCategory.id})`);

    const allSubcategories = await prisma.category.findMany({ where: { parentId: rootCategory.id } });
    const subCategoryMap = new Map<string, string>();
    for (const sub of allSubcategories) subCategoryMap.set(sub.slug, sub.id);
    console.log(`📂 Found ${allSubcategories.length} subcategories`);

    const allBrands = await prisma.brand.findMany();
    const brandMap = new Map<string, string>();
    for (const b of allBrands) {
        brandMap.set(b.slug, b.id);
        brandMap.set(slugify(b.name), b.id);
        brandMap.set(slugifyFull(b.name), b.id);
    }

    let created = 0, updated = 0, skipped = 0;
    const subCategoryFirstImage = new Map<string, string>();

    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const sku = `RTR-${String(i + 1).padStart(4, "0")}`;

        const brandSlug = p.brandName ? slugify(p.brandName) : "";
        const brandSlugFull = p.brandName ? slugifyFull(p.brandName) : "";
        const brandId = brandSlug ? (brandMap.get(brandSlug) || brandMap.get(brandSlugFull) || null) : null;

        if (p.brandName && !brandId) {
            console.log(`   ⚠️  Brand not found: "${p.brandName}"`);
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
                    data: { name: p.name, price: p.price, compareAtPrice: p.compareAtPrice, currency: "TRY", brandId, inStock: p.inStock, badge: p.discountPercent > 0 ? `%${p.discountPercent}` : null, isActive: true },
                });
                await assignCategories(existing.id);
                updated++;
            } else {
                const product = await prisma.product.create({
                    data: { name: p.name, slug: p.slug, sku, price: p.price, compareAtPrice: p.compareAtPrice, currency: "TRY", brandId, inStock: p.inStock, badge: p.discountPercent > 0 ? `%${p.discountPercent}` : null, isActive: true },
                });
                if (p.imageUrl) {
                    await prisma.productImage.create({ data: { productId: product.id, url: p.imageUrl, alt: p.name, order: 0 } });
                }
                await assignCategories(product.id);
                created++;
            }
        } catch (err: any) {
            if (err.code === "P2002" && err.meta?.target?.includes("sku")) {
                try {
                    const fallbackSku = `RTR-${String(i + 1).padStart(4, "0")}-${Date.now() % 10000}`;
                    const product = await prisma.product.create({
                        data: { name: p.name, slug: p.slug, sku: fallbackSku, price: p.price, compareAtPrice: p.compareAtPrice, currency: "TRY", brandId, inStock: p.inStock, badge: p.discountPercent > 0 ? `%${p.discountPercent}` : null, isActive: true },
                    });
                    if (p.imageUrl) {
                        await prisma.productImage.create({ data: { productId: product.id, url: p.imageUrl, alt: p.name, order: 0 } });
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

    console.log("\n📸 Updating subcategory images for mega menu...");
    for (const [subSlug, imageUrl] of subCategoryFirstImage.entries()) {
        const subId = subCategoryMap.get(subSlug);
        if (subId) {
            await prisma.category.update({ where: { id: subId }, data: { image: imageUrl } });
            console.log(`   ✅ ${subSlug}`);
        }
    }

    console.log(`\n✨ CNC Router Import Complete!`);
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total:   ${products.length}\n`);
}

main()
    .catch((e) => { console.error("❌ Import error:", e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
