import { getBlogPostsByCategory, getBlogCategories } from "@/lib/actions/blog";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
    params: { categorySlug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const categories = await getBlogCategories();
    const category = categories.find((c) => c.slug === params.categorySlug);
    if (!category) return { title: "Kategori Bulunamadı" };

    return {
        title: `${category.name} | Blog`,
        description: `${category.name} kategorisindeki blog yazıları ve güncel içerikler.`,
    };
}

export default async function BlogCategoryPage({ params }: Props) {
    const [posts, categories] = await Promise.all([
        getBlogPostsByCategory(params.categorySlug),
        getBlogCategories(),
    ]);

    const category = categories.find((c) => c.slug === params.categorySlug);
    if (!category) notFound();

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
                <Link href="/" className="hover:text-primary flex items-center gap-1">
                    <MaterialIcon icon="home" className="text-lg" /> Ana Sayfa
                </Link>
                <MaterialIcon icon="chevron_right" className="text-gray-300" />
                <Link href="/blog" className="hover:text-primary">Blog</Link>
                <MaterialIcon icon="chevron_right" className="text-gray-300" />
                <span className="text-gray-900 font-medium">{category.name}</span>
            </nav>

            <header className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-1 bg-primary rounded-full"></div>
                    <span className="text-primary font-bold uppercase tracking-widest text-xs">Kategori</span>
                </div>
                <h1 className="text-4xl font-bold font-[family-name:var(--font-display)] text-gray-900">
                    {category.name}
                </h1>
                <p className="text-gray-500 mt-4 max-w-3xl">
                    {category.name} kategorisi altında yayınlanan tüm içerikleri aşağıda bulabilirsiniz.
                </p>
            </header>

            {posts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-md mx-auto">
                    <MaterialIcon icon="inbox" className="text-6xl text-gray-200 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Yazı Bulunamadı</h2>
                    <p className="text-gray-500">Bu kategoride henüz yayınlanmış bir yazı bulunmuyor.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post: any) => (
                        <Link
                            key={post.id}
                            href={`/blog/${category.slug}/${post.slug}`}
                            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
                        >
                            {post.coverImageUrl ? (
                                <div className="aspect-video overflow-hidden relative">
                                    <img
                                        src={post.coverImageUrl}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                        <span className="text-white text-xs font-bold uppercase tracking-widest bg-primary/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">Şimdi Oku</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-video bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-primary/5 transition-colors duration-500">
                                    <MaterialIcon icon="image" className="text-6xl group-hover:text-primary/20 transition-colors" />
                                </div>
                            )}
                            <div className="p-8">
                                <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                                    <MaterialIcon icon="calendar_today" className="text-sm" />
                                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString("tr-TR")}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                {post.excerpt && (
                                    <p className="text-sm text-gray-600 line-clamp-3 mb-6 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                )}
                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <span className="text-primary font-bold text-sm tracking-tight flex items-center">
                                        Devamını Oku <MaterialIcon icon="trending_flat" className="ml-2" />
                                    </span>
                                    <MaterialIcon icon="bookmark_border" className="text-gray-300 group-hover:text-primary transition-colors" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
