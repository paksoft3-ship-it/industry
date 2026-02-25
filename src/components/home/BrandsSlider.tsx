import Link from "next/link";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
}

interface BrandsSliderProps {
  brands: Brand[];
}

export default function BrandsSlider({ brands }: BrandsSliderProps) {
  if (brands.length === 0) return null;

  return (
    <section className="py-12 border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-gray-400 mb-8 uppercase tracking-wider">
          Markalar
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/marka/${brand.slug}`}
              className="opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
              title={brand.name}
            >
              {brand.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <div className="h-10 px-6 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-bold text-sm whitespace-nowrap">
                  {brand.name}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
