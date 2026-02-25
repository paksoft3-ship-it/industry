import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// ────────────── helpers ──────────────

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
        .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

interface RowData {
    SKU: string;
    Name: string;
    Price: string;
    CompareAtPrice?: string;
    StockCount?: string;
    Brand?: string;
    Categories?: string;
    Images?: string;
    Description?: string;
    ShortDescription?: string;
    Attributes?: string;
    Currency?: string;
    Weight?: string;
    IsActive?: string;
    IsFeatured?: string;
}

function parseCSV(text: string): RowData[] {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) return [];

    // Detect delimiter
    const delimiter = lines[0].includes("\t") ? "\t" : lines[0].includes(";") ? ";" : ",";

    const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, ""));
    const rows: RowData[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(delimiter).map((v) => v.trim().replace(/^["']|["']$/g, ""));
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => {
            row[h] = values[idx] || "";
        });
        // Only add rows that have at least SKU and Name
        if (row.SKU && row.Name) {
            rows.push(row as unknown as RowData);
        }
    }
    return rows;
}

function parseXML(text: string): RowData[] {
    const rows: RowData[] = [];
    const productMatches = text.match(/<Product>([\s\S]*?)<\/Product>/gi);
    if (!productMatches) return rows;

    for (const block of productMatches) {
        const getTag = (tag: string) => {
            const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
            return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "";
        };

        // handle multi-value tags (Categories, Images, Attributes)
        const getMultiTag = (parentTag: string, childTag: string) => {
            const parentMatch = block.match(new RegExp(`<${parentTag}>([\\s\\S]*?)<\\/${parentTag}>`, "i"));
            if (!parentMatch) return "";
            const childMatches = parentMatch[1].match(new RegExp(`<${childTag}[^>]*>([\\s\\S]*?)<\\/${childTag}>`, "gi"));
            if (!childMatches) return "";
            return childMatches.map((m) => {
                const inner = m.match(new RegExp(`<${childTag}[^>]*>([\\s\\S]*?)<\\/${childTag}>`, "i"));
                return inner ? inner[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "";
            }).join(",");
        };

        const getAttributes = () => {
            const parentMatch = block.match(/<Attributes>([\s\S]*?)<\/Attributes>/i);
            if (!parentMatch) return "";
            const attrMatches = parentMatch[1].match(/<Attribute[^>]*>[\s\S]*?<\/Attribute>/gi);
            if (!attrMatches) return "";
            return attrMatches.map((m) => {
                const nameMatch = m.match(/name=["']([^"']+)["']/i);
                const valMatch = m.match(/>([^<]+)</);
                if (nameMatch && valMatch) return `${nameMatch[1]}:${valMatch[1].trim()}`;
                return "";
            }).filter(Boolean).join("|");
        };

        const sku = getTag("SKU");
        const name = getTag("Name");
        if (!sku || !name) continue;

        rows.push({
            SKU: sku,
            Name: name,
            Price: getTag("Price"),
            CompareAtPrice: getTag("CompareAtPrice") || undefined,
            StockCount: getTag("StockCount") || undefined,
            Brand: getTag("Brand") || undefined,
            Categories: getMultiTag("Categories", "Category") || undefined,
            Images: getMultiTag("Images", "Image") || undefined,
            Description: getTag("Description") || undefined,
            ShortDescription: getTag("ShortDescription") || undefined,
            Attributes: getAttributes() || undefined,
            Currency: getTag("Currency") || undefined,
            Weight: getTag("Weight") || undefined,
            IsActive: getTag("IsActive") || undefined,
            IsFeatured: getTag("IsFeatured") || undefined,
        });
    }

    return rows;
}

function parseJSON(text: string): RowData[] {
    try {
        const parsed = JSON.parse(text);
        const arr = Array.isArray(parsed) ? parsed : parsed.products || parsed.Products || [];
        return arr.filter((r: RowData) => r.SKU && r.Name);
    } catch {
        return [];
    }
}

// ────────────── main route ──────────────

export async function POST(req: NextRequest) {
    // Auth check
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
        return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    const text = await file.text();
    const fileName = file.name.toLowerCase();

    let rows: RowData[] = [];
    if (fileName.endsWith(".csv") || fileName.endsWith(".tsv") || fileName.endsWith(".txt")) {
        rows = parseCSV(text);
    } else if (fileName.endsWith(".xml")) {
        rows = parseXML(text);
    } else if (fileName.endsWith(".json")) {
        rows = parseJSON(text);
    } else {
        return NextResponse.json({ error: "Desteklenmeyen dosya formatı. CSV, XML veya JSON kullanın." }, { status: 400 });
    }

    if (rows.length === 0) {
        return NextResponse.json({ error: "Dosyada geçerli ürün satırı bulunamadı. Lütfen formatı kontrol edin." }, { status: 400 });
    }

    // Pre-fetch existing brands/categories for lookup
    const existingBrands = await prisma.brand.findMany({ select: { id: true, name: true, slug: true } });
    const brandMap = new Map(existingBrands.map((b) => [b.name.toLowerCase(), b.id]));

    const existingCategories = await prisma.category.findMany({ select: { id: true, name: true, slug: true } });
    const categoryMap = new Map(existingCategories.map((c) => [c.name.toLowerCase(), c.id]));

    const results = {
        created: 0,
        skipped: 0,
        errors: [] as string[],
    };

    // Process in batches of 50
    const BATCH_SIZE = 50;
    for (let batchStart = 0; batchStart < rows.length; batchStart += BATCH_SIZE) {
        const batch = rows.slice(batchStart, batchStart + BATCH_SIZE);

        for (const row of batch) {
            try {
                // Check if product with this SKU already exists
                const existing = await prisma.product.findUnique({ where: { sku: row.SKU } });
                if (existing) {
                    results.skipped++;
                    continue;
                }

                // Resolve brand
                let brandId: string | undefined;
                if (row.Brand) {
                    const brandKey = row.Brand.toLowerCase();
                    if (brandMap.has(brandKey)) {
                        brandId = brandMap.get(brandKey);
                    } else {
                        const brandSlug = slugify(row.Brand);
                        const newBrand = await prisma.brand.create({
                            data: { name: row.Brand, slug: brandSlug },
                        });
                        brandMap.set(brandKey, newBrand.id);
                        brandId = newBrand.id;
                    }
                }

                // Resolve categories
                const categoryIds: string[] = [];
                if (row.Categories) {
                    const catNames = row.Categories.split(",").map((c) => c.trim()).filter(Boolean);
                    for (const catName of catNames) {
                        const catKey = catName.toLowerCase();
                        if (categoryMap.has(catKey)) {
                            categoryIds.push(categoryMap.get(catKey)!);
                        } else {
                            const catSlug = slugify(catName);
                            const newCat = await prisma.category.create({
                                data: { name: catName, slug: catSlug },
                            });
                            categoryMap.set(catKey, newCat.id);
                            categoryIds.push(newCat.id);
                        }
                    }
                }

                // Parse attributes ("Key:Value|Key2:Value2")
                const attributes: { key: string; value: string }[] = [];
                if (row.Attributes) {
                    const pairs = row.Attributes.split("|").map((p) => p.trim()).filter(Boolean);
                    for (const pair of pairs) {
                        const [key, ...rest] = pair.split(":");
                        if (key && rest.length > 0) {
                            attributes.push({ key: key.trim(), value: rest.join(":").trim() });
                        }
                    }
                }

                // Parse images (comma-separated URLs)
                const imageUrls = row.Images
                    ? row.Images.split(",").map((u) => u.trim()).filter(Boolean)
                    : [];

                const productSlug = slugify(row.Name) + "-" + row.SKU.toLowerCase();

                await prisma.product.create({
                    data: {
                        name: row.Name,
                        slug: productSlug,
                        sku: row.SKU,
                        price: parseFloat(row.Price) || 0,
                        compareAtPrice: row.CompareAtPrice ? parseFloat(row.CompareAtPrice) : undefined,
                        currency: row.Currency || "TRY",
                        description: row.Description || undefined,
                        shortDesc: row.ShortDescription || undefined,
                        weight: row.Weight ? parseFloat(row.Weight) : undefined,
                        stockCount: row.StockCount ? parseInt(row.StockCount, 10) : 0,
                        inStock: row.StockCount ? parseInt(row.StockCount, 10) > 0 : true,
                        isActive: row.IsActive ? row.IsActive.toLowerCase() === "true" || row.IsActive === "1" : true,
                        isFeatured: row.IsFeatured ? row.IsFeatured.toLowerCase() === "true" || row.IsFeatured === "1" : false,
                        brandId: brandId || undefined,
                        categories: categoryIds.length > 0
                            ? { create: categoryIds.map((id) => ({ categoryId: id })) }
                            : undefined,
                        attributes: attributes.length > 0
                            ? { create: attributes }
                            : undefined,
                        images: imageUrls.length > 0
                            ? { create: imageUrls.map((url, i) => ({ url, order: i })) }
                            : undefined,
                    },
                });

                results.created++;
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : String(err);
                results.errors.push(`SKU "${row.SKU}": ${errorMsg}`);
            }
        }
    }

    // Audit log
    await prisma.auditLog.create({
        data: {
            userId: session.user.id,
            action: "BULK_IMPORT",
            entity: "Product",
            details: `Toplu ürün yükleme: ${results.created} oluşturuldu, ${results.skipped} atlandı, ${results.errors.length} hata`,
        },
    });

    return NextResponse.json({
        success: true,
        message: `${results.created} ürün başarıyla eklendi. ${results.skipped} ürün (SKU mevcut) atlandı.`,
        ...results,
    });
}
