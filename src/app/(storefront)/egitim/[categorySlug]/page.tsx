import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { getEducationPostsByCategory } from "@/lib/actions/education";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }) {
    const { categorySlug } = await params;
    const category = await prisma.educationCategory.findUnique({
        where: { slug: categorySlug }
    });

    if (!category) return { title: "Kategori Bulunamadı" };

    return {
        title: `${category.name} Eğitimleri | Sanayi Parçaları`,
        description: `${category.name} hakkında teknik bilgiler ve eğitim içerikleri.`
    };
}

export default async function EducationCategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
    const { categorySlug } = await params;

    const category = await prisma.educationCategory.findUnique({
        where: { slug: categorySlug }
    });

    if (!category) notFound();

    const posts = await getEducationPostsByCategory(categorySlug);

    return (
        <div className="min-h-screen bg-background-light">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
                    <MaterialIcon icon="chevron_right" className="text-base" />
                    <Link href="/egitim" className="hover:text-primary transition-colors">Eğitim & Blog</Link>
                    <MaterialIcon icon="chevron_right" className="text-base" />
                    <span className="text-primary font-medium">{category.name}</span>
                </nav>

                {/* Hero Section */}
                <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-10 shadow-sm">
                    <h1 className="text-3xl font-bold text-primary font-[family-name:var(--font-display)] mb-2">
                        {category.name} Eğitimleri
                    </h1>
                    <p className="text-gray-500 max-w-2xl">
                        {category.name} kategorisindeki uzman görüşleri, teknik makaleler ve rehberler.
                    </p>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post: any) => (
                        <Link
                            key={post.id}
                            href={`/egitim/${categorySlug}/${post.slug}`}
                            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {/* Image Placeholder or Actual Image */}
                            <div className="aspect-[16/10] bg-gray-50 relative overflow-hidden">
                                {post.coverImageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={post.coverImageUrl}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <MaterialIcon icon="article" className="text-5xl text-gray-200" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase tracking-wider shadow-sm">
                                        {category.name}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-3 text-[11px] text-gray-400 uppercase tracking-widest font-bold">
                                    <span className="flex items-center gap-1">
                                        <MaterialIcon icon="calendar_today" className="text-sm" />
                                        {new Date(post.createdAt).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-primary/70 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-3 mb-6 leading-relaxed">
                                    {post.excerpt || "İçerik özeti bulunmuyor."}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <span className="text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Devamını Oku
                                        <MaterialIcon icon="arrow_forward" className="text-sm" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <MaterialIcon icon="layers_clear" className="text-5xl text-gray-200 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400">Bu kategoride henüz yazı bulunmuyor</h3>
                        <Link href="/egitim" className="text-primary font-medium hover:underline mt-4 inline-block">
                            Diğer eğitimlere göz atın
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
