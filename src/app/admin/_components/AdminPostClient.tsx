"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MaterialIcon from "@/components/ui/MaterialIcon";
import MediaUploader from "@/components/admin/MediaUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface Category {
    id: string;
    name: string;
}

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImageUrl: string | null;
    categoryId: string;
    isPublished: boolean;
    seoTitle: string | null;
    seoDescription: string | null;
    createdAt: string;
    category: { name: string };
}

interface Props {
    title: string;
    posts: Post[];
    categories: Category[];
    actions: {
        create: (data: any) => Promise<any>;
        update: (id: string, data: any) => Promise<any>;
        delete: (id: string) => Promise<any>;
    };
}

const emptyPost = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImageUrl: "",
    categoryId: "",
    isPublished: false,
    seoTitle: "",
    seoDescription: "",
};

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

export default function AdminPostClient({ title, posts, categories, actions }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyPost);

    function openCreate() {
        setEditingId(null);
        setForm({ ...emptyPost, categoryId: categories[0]?.id ?? "" });
        setModalOpen(true);
    }

    function openEdit(post: Post) {
        setEditingId(post.id);
        setForm({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt ?? "",
            content: post.content ?? "",
            coverImageUrl: post.coverImageUrl ?? "",
            categoryId: post.categoryId,
            isPublished: post.isPublished,
            seoTitle: post.seoTitle ?? "",
            seoDescription: post.seoDescription ?? "",
        });
        setModalOpen(true);
    }

    async function handleRemoveCoverImage() {
        if (!form.coverImageUrl) return;
        const urlToDelete = form.coverImageUrl;
        setForm(prev => ({ ...prev, coverImageUrl: "" }));
        try {
            if (urlToDelete.includes("public.blob.vercel-storage.com")) {
                await fetch(`/api/blob/delete?url=${encodeURIComponent(urlToDelete)}`, { method: "DELETE" });
            }
            toast.success("Kapak görseli kaldırıldı");
        } catch {
            toast.error("Görsel silinemedi");
        }
    }

    function handleTitleChange(title: string) {
        setForm((prev) => ({
            ...prev,
            title,
            slug: editingId ? prev.slug : slugify(title),
        }));
    }

    function save() {
        startTransition(async () => {
            try {
                if (editingId) {
                    await actions.update(editingId, form);
                    toast.success("Yazı güncellendi");
                } else {
                    await actions.create(form);
                    toast.success("Yazı oluşturuldu");
                }
                setModalOpen(false);
                router.refresh();
            } catch (err: any) {
                toast.error(err.message || "Bir hata oluştu");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
        startTransition(async () => {
            try {
                await actions.delete(id);
                toast.success("Yazı silindi");
                router.refresh();
            } catch (err: any) {
                toast.error(err.message || "Bir hata oluştu");
            }
        });
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-800">
                        {title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Yazı listesini yönetin</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                    <MaterialIcon icon="add" className="text-[20px]" />
                    Yeni Yazı
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {posts.length === 0 ? (
                    <div className="px-6 py-12 text-center text-gray-400 font-medium">
                        Henüz yazı eklenmemiş.
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Başlık</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Kategori</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Durum</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tarih</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-gray-800">{post.title}</td>
                                    <td className="px-6 py-4 text-gray-500">{post.category?.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${post.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                            {post.isPublished ? "Yayında" : "Taslak"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{new Date(post.createdAt).toLocaleDateString("tr-TR")}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => openEdit(post)} className="text-gray-400 hover:text-primary p-1">
                                            <MaterialIcon icon="edit" className="text-[20px]" />
                                        </button>
                                        <button onClick={() => handleDelete(post.id)} disabled={isPending} className="text-gray-400 hover:text-red-500 p-1">
                                            <MaterialIcon icon="delete" className="text-[20px]" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 transform transition-all">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                            <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-gray-800">
                                {editingId ? "Yazıyı Düzenle" : "Yeni Yazı"}
                            </h3>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                                <MaterialIcon icon="close" className="text-[24px]" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Başlık</label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
                                    <input
                                        type="text"
                                        value={form.slug}
                                        onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 italic text-gray-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                                    <select
                                        value={form.categoryId}
                                        onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none"
                                    >
                                        <option value="">Kategori seçin</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Özet (Listing) Başlığı</label>
                                    <textarea
                                        rows={3}
                                        value={form.excerpt}
                                        onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kapak Görseli</label>
                                    {form.coverImageUrl ? (
                                        <div className="mb-4 relative group">
                                            <div className="h-40 w-full bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
                                                <img src={form.coverImageUrl} alt="" className="h-full w-full object-cover" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemoveCoverImage}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <MaterialIcon icon="delete" className="text-lg" />
                                            </button>
                                        </div>
                                    ) : (
                                        <MediaUploader
                                            folderPrefix="posts"
                                            onUploaded={(items) => setForm(prev => ({ ...prev, coverImageUrl: items[0].url }))}
                                        />
                                    )}
                                </div>

                                <div className="p-4 bg-gray-50 rounded-2xl space-y-4">
                                    <div className="flex items-center gap-4">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={form.isPublished}
                                                onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                        <span className="text-sm font-bold text-gray-700 uppercase tracking-tight">Yayınla</span>
                                    </div>
                                    <p className="text-[11px] text-gray-400">Yayınlandığında sitede herkese açık hale gelir.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">SEO Başlık (Meta Title)</label>
                                    <input
                                        type="text"
                                        value={form.seoTitle}
                                        onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">SEO Açıklama (Meta Desc)</label>
                                    <textarea
                                        rows={2}
                                        value={form.seoDescription}
                                        onChange={(e) => setForm((prev) => ({ ...prev, seoDescription: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>

                            {/* Full Width Bottom */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">İçerik</label>
                                <RichTextEditor
                                    value={form.content}
                                    onChange={(value) => setForm((prev) => ({ ...prev, content: value }))}
                                    placeholder="Yazı içeriğini buraya yazın..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-100">
                            <button onClick={() => setModalOpen(false)} className="px-6 py-3 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
                                İptal
                            </button>
                            <button
                                onClick={save}
                                disabled={isPending || !form.title || !form.slug || !form.categoryId}
                                className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                            >
                                {isPending && <MaterialIcon icon="progress_activity" className="text-[20px] animate-spin" />}
                                {editingId ? "Güncelle" : "Oluştur"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
