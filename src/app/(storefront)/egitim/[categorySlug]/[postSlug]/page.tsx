import { getEducationPostBySlug } from "@/lib/actions/education";
import { notFound } from "next/navigation";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

interface PageProps {
    params: { categorySlug: string; postSlug: string };
}

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string; postSlug: string }> }) {
    const { categorySlug, postSlug } = await params;
    const post = await getEducationPostBySlug(categorySlug, postSlug);

    if (!post) return { title: "Yazı Bulunamadı" };

    return {
        title: `${post.seoTitle || post.title} | Sanayi Parçaları Eğitim`,
        description: post.seoDescription || post.excerpt,
    };
}

export default async function EducationPostPage({ params }: { params: Promise<{ categorySlug: string; postSlug: string }> }) {
    const { categorySlug, postSlug } = await params;
    const post = await getEducationPostBySlug(categorySlug, postSlug);

    if (!post) notFound();

    return (
        <article className="min-h-screen bg-background-light">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
                    <MaterialIcon icon="chevron_right" className="text-base" />
                    <Link href="/egitim" className="hover:text-primary transition-colors">Eğitim & Blog</Link>
                    <MaterialIcon icon="chevron_right" className="text-base" />
                    <Link href={`/egitim/${categorySlug}`} className="hover:text-primary transition-colors">{post.category.name}</Link>
                    <MaterialIcon icon="chevron_right" className="text-base" />
                    <span className="text-primary font-medium truncate max-w-[200px] sm:max-w-none">{post.title}</span>
                </nav>

                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <header className="mb-10 text-center">
                        <Link
                            href={`/egitim/${categorySlug}`}
                            className="inline-block bg-primary/10 text-primary text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-6 hover:bg-primary hover:text-white transition-all"
                        >
                            {post.category.name}
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-bold text-primary font-[family-name:var(--font-display)] leading-tight mb-6">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
                            <time className="flex items-center gap-2">
                                <MaterialIcon icon="calendar_today" className="text-base text-primary/40" />
                                {new Date(post.createdAt).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}
                            </time>
                            <span className="flex items-center gap-2">
                                <MaterialIcon icon="schedule" className="text-base text-primary/40" />
                                {Math.ceil((post.content?.length || 0) / 1000)} dk okuma
                            </span>
                        </div>
                    </header>

                    {/* Cover Image */}
                    {post.coverImageUrl && (
                        <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={post.coverImageUrl}
                                alt={post.title}
                                className="w-full h-auto"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12">
                        {post.excerpt && (
                            <div className="text-xl font-medium text-gray-500 italic border-l-4 border-primary/20 pl-6 mb-12 leading-relaxed">
                                {post.excerpt}
                            </div>
                        )}

                        <div className="prose prose-lg prose-primary max-w-none">
                            {post.content.split('\n').map((para: string, i: number) => (
                                para ? <p key={i} className="mb-6 leading-relaxed text-gray-700">{para}</p> : <br key={i} />
                            ))}
                        </div>

                        {/* Footer / Sharing */}
                        <div className="mt-16 pt-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Paylaş:</span>
                                <div className="flex items-center gap-2">
                                    {[
                                        { icon: 'facebook', label: 'Facebook' },
                                        { icon: 'linkedin', label: 'LinkedIn' },
                                        { icon: 'x', label: 'Twitter' }
                                    ].map(social => (
                                        <button
                                            key={social.label}
                                            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary/60 hover:bg-primary hover:text-white transition-all shadow-sm"
                                        >
                                            <MaterialIcon icon="share" className="text-xl" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Link
                                href={`/egitim/${categorySlug}`}
                                className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider hover:gap-4 transition-all"
                            >
                                TÜM {post.category.name} EĞİTİMLERİ
                                <MaterialIcon icon="arrow_forward" className="text-lg" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
