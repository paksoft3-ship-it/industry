"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MaterialIcon from "@/components/ui/MaterialIcon";

interface Category {
    id: string;
    name: string;
    slug: string;
    order: number;
    isActive: boolean;
    _count: { posts: number };
}

interface Props {
    title: string;
    categories: Category[];
    actions: {
        create: (data: any) => Promise<any>;
        update: (id: string, data: any) => Promise<any>;
        delete: (id: string) => Promise<any>;
    };
}

const emptyCategory = {
    name: "",
    slug: "",
    order: 0,
    isActive: true,
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

export default function AdminCategoryClient({ title, categories, actions }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyCategory);

    function openCreate() {
        setEditingId(null);
        setForm(emptyCategory);
        setModalOpen(true);
    }

    function openEdit(cat: Category) {
        setEditingId(cat.id);
        setForm({ name: cat.name, slug: cat.slug, order: cat.order, isActive: cat.isActive });
        setModalOpen(true);
    }

    function handleNameChange(name: string) {
        setForm((prev) => ({
            ...prev,
            name,
            slug: editingId ? prev.slug : slugify(name),
        }));
    }

    function save() {
        startTransition(async () => {
            try {
                if (editingId) {
                    await actions.update(editingId, form);
                    toast.success("Kategori güncellendi");
                } else {
                    await actions.create(form);
                    toast.success("Kategori oluşturuldu");
                }
                setModalOpen(false);
                router.refresh();
            } catch (err: any) {
                toast.error(err.message || "Bir hata oluştu");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
        startTransition(async () => {
            try {
                await actions.delete(id);
                toast.success("Kategori silindi");
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
                    <p className="text-sm text-gray-500 mt-1">Kategori listesini yönetin</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                    <MaterialIcon icon="add" className="text-[20px]" />
                    Yeni Kategori
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {categories.length === 0 ? (
                    <div className="px-6 py-12 text-center text-gray-400 font-medium">
                        Henüz kategori eklenmemiş.
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Ad</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Slug</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Yazı Sayısı</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Aktif</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Sıra</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-gray-800">{cat.name}</td>
                                    <td className="px-6 py-4 text-gray-500 italic">{cat.slug}</td>
                                    <td className="px-6 py-4 text-gray-500 font-medium">{cat._count.posts}</td>
                                    <td className="px-6 py-4">
                                        <MaterialIcon
                                            icon={cat.isActive ? "check_circle" : "cancel"}
                                            className={cat.isActive ? "text-green-500" : "text-gray-300"}
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{cat.order}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => openEdit(cat)} className="text-gray-400 hover:text-primary p-1">
                                            <MaterialIcon icon="edit" className="text-[20px]" />
                                        </button>
                                        <button onClick={() => handleDelete(cat.id)} disabled={isPending} className="text-gray-400 hover:text-red-500 p-1">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-gray-800">
                                {editingId ? "Kategoriyi Düzenle" : "Yeni Kategori"}
                            </h3>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                                <MaterialIcon icon="close" className="text-[24px]" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori Adı</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="Örn: CNC Teknikleri"
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
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Görüntüleme Sırası</label>
                                <input
                                    type="number"
                                    value={form.order}
                                    onChange={(e) => setForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                />
                            </div>

                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.isActive}
                                        onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                                <span className="text-sm font-semibold text-gray-700">Kategori Aktif (Sitede Görünür)</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-100">
                            <button onClick={() => setModalOpen(false)} className="px-6 py-3 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
                                İptal
                            </button>
                            <button
                                onClick={save}
                                disabled={isPending || !form.name || !form.slug}
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
