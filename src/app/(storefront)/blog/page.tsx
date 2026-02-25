import { getBlogCategories } from "@/lib/actions/blog";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog | Sanayi ve Endüstriyel Çözümler",
    description: "Sektörel haberler, teknik makaleler ve ürün incelemeleri ile sanayi dünyasındaki gelişmeleri takip edin.",
};

export default async function BlogPage() {
    const categories = await getBlogCategories();

    return (
        <div className="container mx-auto px-4 py-12">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold font-[family-name:var(--font-display)] text-gray-900 mb-4 transition-all hover:text-primary">
                    Blog
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Endüstriyel dünyadan haberler, teknik rehberler ve sektördeki en son gelişmeler için blog sayfamızı takip edin.
                </p>
                <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
            </header>

            {categories.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <MaterialIcon icon="article" className="text-6xl text-gray-200 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Henüz İçerik Yok</h2>
                    <p className="text-gray-500">Blog sayfamız çok yakında ilginç içeriklerle dolacak. Lütfen daha sonra tekrar ziyaret edin.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((cat: any) => (
                        <Link
                            key={cat.id}
                            href={`/blog/${cat.slug}`}
                            className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <MaterialIcon icon="category" className="text-6xl" />
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <MaterialIcon icon="auto_stories" className="text-2xl" />
                                </div>
                                <div className="bg-gray-50 px-3 py-1 rounded-full text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    {cat._count.posts} Yazı
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                                {cat.name}
                            </h2>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-6">
                                {cat.name} hakkındaki tüm yazılarımızı, teknik detayları ve sektördeki son durumu burada bulabilirsiniz.
                            </p>

                            <div className="flex items-center text-primary font-bold text-sm tracking-tight opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                                İncele <MaterialIcon icon="arrow_forward" className="ml-2 text-lg" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
