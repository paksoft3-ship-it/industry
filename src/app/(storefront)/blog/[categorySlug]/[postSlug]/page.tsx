import { getBlogPostBySlug } from "@/lib/actions/blog";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
    params: { categorySlug: string; postSlug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await getBlogPostBySlug(params.categorySlug, params.postSlug);
    if (!post) return { title: "Yazı Bulunamadı" };

    const p = post as any;
    return {
        title: p.seoTitle || `${p.title} | Blog`,
        description: p.seoDescription || p.excerpt || `${p.title} hakkında detaylı bilgi.`,
    };
}

export default async function BlogPostDetailPage({ params }: Props) {
    const post = await getBlogPostBySlug(params.categorySlug, params.postSlug);
    if (!post) notFound();

    const p = post as any;

    return (
        <article className="pb-24">
            {/* Header / Hero Section */}
            <div className="bg-gray-50 pt-12 pb-24 border-b border-gray-100">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-12 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
                        <Link href="/" className="hover:text-primary flex items-center gap-1">
                            <MaterialIcon icon="home" className="text-lg" /> Ana Sayfa
                        </Link>
                        <MaterialIcon icon="chevron_right" className="text-gray-300" />
                        <Link href="/blog" className="hover:text-primary">Blog</Link>
                        <MaterialIcon icon="chevron_right" className="text-gray-300" />
                        <Link href={`/blog/${p.category.slug}`} className="hover:text-primary">
                            {p.category.name}
                        </Link>
                        <MaterialIcon icon="chevron_right" className="text-gray-300" />
                        <span className="text-gray-900 font-medium line-clamp-1">{p.title}</span>
                    </nav>

                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <Link
                                href={`/blog/${p.category.slug}`}
                                className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                                {p.category.name}
                            </Link>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <MaterialIcon icon="calendar_today" className="text-base" />
                                {new Date(p.publishedAt || p.createdAt).toLocaleDateString("tr-TR")}
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-[family-name:var(--font-display)] text-gray-900 mb-8 leading-tight">
                            {p.title}
                        </h1>
                        {p.excerpt && (
                            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto italic font-medium">
                                "{p.excerpt}"
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="container mx-auto px-4 -mt-12">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    {p.coverImageUrl && (
                        <div className="aspect-[21/9] w-full relative overflow-hidden">
                            <img
                                src={p.coverImageUrl}
                                alt={p.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-8 md:p-16">
                        <div
                            className="prose prose-lg prose-slate max-w-none prose-headings:font-[family-name:var(--font-display)] prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary prose-a:font-bold prose-img:rounded-3xl prose-img:shadow-lg"
                            dangerouslySetInnerHTML={{ __html: p.content || "" }}
                        />

                        {/* Footer / Share */}
                        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Paylaş:</span>
                                <div className="flex gap-2">
                                    {["facebook", "twitter", "linkedin", "whatsapp"].map((social) => (
                                        <button key={social} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary/10 hover:text-primary transition-all">
                                            <MaterialIcon icon="share" className="text-lg" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Link
                                href={`/blog/${post.category.slug}`}
                                className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold text-sm tracking-tight"
                            >
                                <MaterialIcon icon="arrow_back" /> {post.category.name} Kategorisine Dön
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
