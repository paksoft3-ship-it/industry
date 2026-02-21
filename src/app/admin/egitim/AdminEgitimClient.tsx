"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MaterialIcon from "@/components/ui/MaterialIcon";
import {
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/actions/blog";

// Types
interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  _count: { posts: number };
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  categoryId: string;
  authorName: string | null;
  isPublished: boolean;
  seoTitle: string | null;
  seoDesc: string | null;
  createdAt: string;
  category: { name: string };
}

interface Props {
  categories: BlogCategory[];
  posts: BlogPost[];
}

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

// Post form defaults
const emptyPost = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image: "",
  categoryId: "",
  authorName: "",
  isPublished: false,
  seoTitle: "",
  seoDesc: "",
};

// Category form defaults
const emptyCategory = {
  name: "",
  slug: "",
  sortOrder: 0,
};

export default function AdminEgitimClient({ categories, posts }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Tabs
  const [activeTab, setActiveTab] = useState<"posts" | "categories">("posts");

  // Post modal
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postForm, setPostForm] = useState(emptyPost);

  // Category modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catForm, setCatForm] = useState(emptyCategory);

  // --- Post handlers ---
  function openCreatePost() {
    setEditingPostId(null);
    setPostForm({ ...emptyPost, categoryId: categories[0]?.id ?? "" });
    setPostModalOpen(true);
  }

  function openEditPost(post: BlogPost) {
    setEditingPostId(post.id);
    setPostForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      content: post.content ?? "",
      image: post.image ?? "",
      categoryId: post.categoryId,
      authorName: post.authorName ?? "",
      isPublished: post.isPublished,
      seoTitle: post.seoTitle ?? "",
      seoDesc: post.seoDesc ?? "",
    });
    setPostModalOpen(true);
  }

  function handlePostTitleChange(title: string) {
    setPostForm((prev) => ({
      ...prev,
      title,
      slug: editingPostId ? prev.slug : slugify(title),
    }));
  }

  function savePost() {
    startTransition(async () => {
      try {
        const data = {
          title: postForm.title,
          slug: postForm.slug,
          excerpt: postForm.excerpt || undefined,
          content: postForm.content || undefined,
          image: postForm.image || undefined,
          categoryId: postForm.categoryId,
          authorName: postForm.authorName || undefined,
          isPublished: postForm.isPublished,
          seoTitle: postForm.seoTitle || undefined,
          seoDesc: postForm.seoDesc || undefined,
        };
        if (editingPostId) {
          await updateBlogPost(editingPostId, data);
          toast.success("Yazı guncellendi");
        } else {
          await createBlogPost(data as Parameters<typeof createBlogPost>[0]);
          toast.success("Yazı oluşturuldu");
        }
        setPostModalOpen(false);
        router.refresh();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    });
  }

  function handleDeletePost(id: string) {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      try {
        await deleteBlogPost(id);
        toast.success("Yazı silindi");
        router.refresh();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    });
  }

  // --- Category handlers ---
  function openCreateCategory() {
    setEditingCatId(null);
    setCatForm(emptyCategory);
    setCatModalOpen(true);
  }

  function openEditCategory(cat: BlogCategory) {
    setEditingCatId(cat.id);
    setCatForm({ name: cat.name, slug: cat.slug, sortOrder: cat.sortOrder });
    setCatModalOpen(true);
  }

  function handleCatNameChange(name: string) {
    setCatForm((prev) => ({
      ...prev,
      name,
      slug: editingCatId ? prev.slug : slugify(name),
    }));
  }

  function saveCategory() {
    startTransition(async () => {
      try {
        const data = {
          name: catForm.name,
          slug: catForm.slug,
          sortOrder: catForm.sortOrder,
        };
        if (editingCatId) {
          await updateBlogCategory(editingCatId, data);
          toast.success("Kategori guncellendi");
        } else {
          await createBlogCategory(data);
          toast.success("Kategori oluşturuldu");
        }
        setCatModalOpen(false);
        router.refresh();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    });
  }

  function handleDeleteCategory(id: string) {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      try {
        await deleteBlogCategory(id);
        toast.success("Kategori silindi");
        router.refresh();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-800">
            Blog / Egitim
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Blog yazilari ve egitim iceriklerini yonetin
          </p>
        </div>
        <button
          onClick={activeTab === "posts" ? openCreatePost : openCreateCategory}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <MaterialIcon icon="add" className="text-[20px]" />
          {activeTab === "posts" ? "Yeni Yazi" : "Yeni Kategori"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "posts"
              ? "bg-white text-gray-800 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Yazilar
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "categories"
              ? "bg-white text-gray-800 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Kategoriler
        </button>
      </div>

      {/* Posts Tab */}
      {activeTab === "posts" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {posts.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              Henuz yazı eklenmemis.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Baslik
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Kategori
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Durum
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Tarih
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Islemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {post.title}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {post.category?.name}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {post.isPublished ? "Yayinda" : "Taslak"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditPost(post)}
                        className="text-gray-400 hover:text-primary mr-2"
                      >
                        <MaterialIcon icon="edit" className="text-[18px]" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        disabled={isPending}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <MaterialIcon icon="delete" className="text-[18px]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {categories.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              Henuz kategori eklenmemis.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Ad
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Slug
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Yazi Sayisi
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Sira
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Islemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {cat._count.posts}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {cat.sortOrder}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditCategory(cat)}
                        className="text-gray-400 hover:text-primary mr-2"
                      >
                        <MaterialIcon icon="edit" className="text-[18px]" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        disabled={isPending}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <MaterialIcon icon="delete" className="text-[18px]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Post Modal */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-gray-800">
                {editingPostId ? "Yaziyi Duzenle" : "Yeni Yazi"}
              </h3>
              <button
                onClick={() => setPostModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MaterialIcon icon="close" className="text-[24px]" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Baslik
                </label>
                <input
                  type="text"
                  value={postForm.title}
                  onChange={(e) => handlePostTitleChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={postForm.slug}
                  onChange={(e) =>
                    setPostForm((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={postForm.categoryId}
                  onChange={(e) =>
                    setPostForm((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Kategori secin</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ozet
                </label>
                <textarea
                  rows={2}
                  value={postForm.excerpt}
                  onChange={(e) =>
                    setPostForm((prev) => ({
                      ...prev,
                      excerpt: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icerik
                </label>
                <textarea
                  rows={6}
                  value={postForm.content}
                  onChange={(e) =>
                    setPostForm((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Author Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yazar Adi
                </label>
                <input
                  type="text"
                  value={postForm.authorName}
                  onChange={(e) =>
                    setPostForm((prev) => ({
                      ...prev,
                      authorName: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gorsel URL
                </label>
                <input
                  type="text"
                  value={postForm.image}
                  onChange={(e) =>
                    setPostForm((prev) => ({ ...prev, image: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* isPublished toggle */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={postForm.isPublished}
                    onChange={(e) =>
                      setPostForm((prev) => ({
                        ...prev,
                        isPublished: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <span className="text-sm font-medium text-gray-700">
                  Yayinda
                </span>
              </div>

              {/* SEO Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SEO Baslik
                </label>
                <input
                  type="text"
                  value={postForm.seoTitle}
                  onChange={(e) =>
                    setPostForm((prev) => ({
                      ...prev,
                      seoTitle: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* SEO Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SEO Aciklama
                </label>
                <textarea
                  rows={2}
                  value={postForm.seoDesc}
                  onChange={(e) =>
                    setPostForm((prev) => ({
                      ...prev,
                      seoDesc: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setPostModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Iptal
              </button>
              <button
                onClick={savePost}
                disabled={isPending || !postForm.title || !postForm.slug || !postForm.categoryId}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {isPending && (
                  <MaterialIcon icon="progress_activity" className="text-[18px] animate-spin" />
                )}
                {editingPostId ? "Guncelle" : "Olustur"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-gray-800">
                {editingCatId ? "Kategoriyi Duzenle" : "Yeni Kategori"}
              </h3>
              <button
                onClick={() => setCatModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MaterialIcon icon="close" className="text-[24px]" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Adi
                </label>
                <input
                  type="text"
                  value={catForm.name}
                  onChange={(e) => handleCatNameChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={catForm.slug}
                  onChange={(e) =>
                    setCatForm((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sira
                </label>
                <input
                  type="number"
                  value={catForm.sortOrder}
                  onChange={(e) =>
                    setCatForm((prev) => ({
                      ...prev,
                      sortOrder: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setCatModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Iptal
              </button>
              <button
                onClick={saveCategory}
                disabled={isPending || !catForm.name || !catForm.slug}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {isPending && (
                  <MaterialIcon icon="progress_activity" className="text-[18px] animate-spin" />
                )}
                {editingCatId ? "Guncelle" : "Olustur"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
