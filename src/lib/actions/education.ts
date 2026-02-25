"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Turkish slugify
function slugify(text: string): string {
    return text
        .replace(/ç/g, "c").replace(/Ç/g, "c")
        .replace(/ğ/g, "g").replace(/Ğ/g, "g")
        .replace(/ı/g, "i").replace(/İ/g, "i")
        .replace(/ö/g, "o").replace(/Ö/g, "o")
        .replace(/ş/g, "s").replace(/Ş/g, "s")
        .replace(/ü/g, "u").replace(/Ü/g, "u")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// Education Categories
export async function getEducationCategories() {
    return prisma.educationCategory.findMany({
        include: { _count: { select: { posts: true } } },
        orderBy: { order: "asc" },
    });
}

export async function createEducationCategory(data: { name: string; slug?: string; order?: number }) {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
        throw new Error("Unauthorized");

    const slug = data.slug || slugify(data.name);
    const cat = await prisma.educationCategory.create({
        data: {
            ...data,
            slug
        }
    });

    await prisma.auditLog.create({
        data: {
            userId: session.user.id,
            action: "CREATE",
            entity: "EducationCategory",
            entityId: cat.id,
            details: `Eğitim kategorisi: ${cat.name}`
        }
    });

    revalidatePath("/admin/egitim");
    revalidatePath("/egitim");
    return cat;
}

export async function updateEducationCategory(id: string, data: { name?: string; slug?: string; order?: number; isActive?: boolean }) {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
        throw new Error("Unauthorized");

    const cat = await prisma.educationCategory.update({ where: { id }, data });

    await prisma.auditLog.create({
        data: {
            userId: session.user.id,
            action: "UPDATE",
            entity: "EducationCategory",
            entityId: cat.id,
            details: `Eğitim kategorisi güncellendi: ${cat.name}`
        }
    });

    revalidatePath("/admin/egitim");
    revalidatePath("/egitim");
    return cat;
}

export async function deleteEducationCategory(id: string) {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
        throw new Error("Unauthorized");

    const cat = await prisma.educationCategory.findUnique({
        where: { id },
        include: { _count: { select: { posts: true } } }
    });

    if (!cat) throw new Error("Kategori bulunamadı");
    if (cat._count.posts > 0) throw new Error(`Bu kategoride ${cat._count.posts} yazı var. Önce yazıları silin.`);

    await prisma.educationCategory.delete({ where: { id } });

    await prisma.auditLog.create({
        data: {
            userId: session.user.id,
            action: "DELETE",
            entity: "EducationCategory",
            entityId: id,
            details: `Eğitim kategorisi silindi: ${cat.name}`
        }
    });

    revalidatePath("/admin/egitim");
    revalidatePath("/egitim");
}

// Education Posts
export async function getEducationPosts({ page = 1, limit = 20 } = {}) {
    const [posts, total] = await Promise.all([
        prisma.educationPost.findMany({
            include: { category: { select: { name: true } } },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.educationPost.count(),
    ]);
    return { posts, total, totalPages: Math.ceil(total / limit), page };
}

export async function getEducationPostBySlug(categorySlug: string, postSlug: string) {
    return prisma.educationPost.findFirst({
        where: {
            slug: postSlug,
            category: { slug: categorySlug },
            isPublished: true
        },
        include: {
            category: true
        }
    });
}

export async function getEducationPostsByCategory(categorySlug: string) {
    return prisma.educationPost.findMany({
        where: {
            category: { slug: categorySlug },
            isPublished: true
        },
        orderBy: { createdAt: "desc" }
    });
}

export async function createEducationPost(data: {
    title: string;
    slug?: string;
    excerpt?: string;
    content: string;
    coverImageUrl?: string;
    categoryId: string;
    isPublished?: boolean;
    seoTitle?: string;
    seoDescription?: string;
}) {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
        throw new Error("Unauthorized");

    const slug = data.slug || slugify(data.title);
    const post = await prisma.educationPost.create({
        data: {
            ...data,
            slug,
            publishedAt: data.isPublished ? new Date() : null
        },
    });

    await prisma.auditLog.create({
        data: {
            userId: session.user.id,
            action: "CREATE",
            entity: "EducationPost",
            entityId: post.id,
            details: `Eğitim yazısı: ${post.title}`
        }
    });

    revalidatePath("/admin/egitim");
    revalidatePath("/egitim");
    return post;
}

export async function updateEducationPost(id: string, data: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImageUrl?: string;
    categoryId?: string;
    isPublished?: boolean;
    seoTitle?: string;
    seoDescription?: string;
}) {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
        throw new Error("Unauthorized");

    const updateData: any = { ...data };

    if (data.isPublished !== undefined) {
        const existing = await prisma.educationPost.findUnique({ where: { id }, select: { publishedAt: true } });
        if (data.isPublished && !existing?.publishedAt) {
            updateData.publishedAt = new Date();
        } else if (data.isPublished === false) {
            updateData.publishedAt = null;
        }
    }

    const post = await prisma.educationPost.update({ where: { id }, data: updateData });

    await prisma.auditLog.create({
        data: {
            userId: session.user.id,
            action: "UPDATE",
            entity: "EducationPost",
            entityId: post.id,
            details: `Eğitim yazısı güncellendi: ${post.title}`
        }
    });

    revalidatePath("/admin/egitim");
    revalidatePath("/egitim");
    return post;
}

export async function deleteEducationPost(id: string) {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
        throw new Error("Unauthorized");

    const post = await prisma.educationPost.findUnique({ where: { id }, select: { title: true } });
    if (!post) throw new Error("Yazı bulunamadı");

    await prisma.educationPost.delete({ where: { id } });

    await prisma.auditLog.create({
        data: {
            userId: session.user.id,
            action: "DELETE",
            entity: "EducationPost",
            entityId: id,
            details: `Eğitim yazısı silindi: ${post.title}`
        }
    });

    revalidatePath("/admin/egitim");
    revalidatePath("/egitim");
}
