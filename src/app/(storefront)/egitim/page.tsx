import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { getEducationCategories } from "@/lib/actions/education";

export const metadata = {
    title: "Eğitim & Blog | Sanayi Parçaları",
    description: "Teknik bilgiler, ürün incelemeleri ve sektör haberleri.",
};

export default async function EducationPage() {
    const categories = await getEducationCategories();

    return (
        <div className="min-h-screen bg-background-light">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
                    <MaterialIcon icon="chevron_right" className="text-base" />
                    <span className="text-primary font-medium">Eğitim & Blog</span>
                </nav>

                {/* Title */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary font-[family-name:var(--font-display)] mb-2">
                        Eğitim & Blog
                    </h1>
                    <p className="text-gray-500 max-w-2xl">
                        Sektörel gelişiminiz için özenle hazırladığımız teknik makaleler, ürün incelemeleri ve uygulama rehberleri.
                    </p>
                </div>

                {/* Category Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((cat: any) => (
                        <Link
                            key={cat.id}
                            href={`/egitim/${cat.slug}`}
                            className="group bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:rotate-6 transition-all duration-300">
                                <MaterialIcon
                                    icon="school"
                                    className="text-3xl text-primary group-hover:text-white transition-colors"
                                />
                            </div>
                            <h3 className="font-bold text-lg text-primary mb-2">{cat.name}</h3>
                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                                {cat.name} hakkındaki tüm eğitim içerikleri ve teknik bilgiler.
                            </p>
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                                {cat._count.posts} İçerik
                                <MaterialIcon icon="arrow_forward" className="text-sm" />
                            </span>
                        </Link>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
                        <MaterialIcon icon="drafts" className="text-5xl text-gray-200 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-400">Henüz bir kategori eklenmemiş</h3>
                    </div>
                )}
            </div>
        </div>
    );
}
