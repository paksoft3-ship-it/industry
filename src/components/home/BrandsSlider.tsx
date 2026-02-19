export default function BrandsSlider() {
  const brands = [
    "Siemens", "Hiwin", "THK", "Omron", "Delta"
  ];

  return (
    <section className="border-t border-gray-100 pt-10">
      <p className="text-center text-sm font-semibold text-gray-400 mb-8 uppercase tracking-wider">
        Çözüm Ortaklarımız
      </p>
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        {brands.map((brand) => (
          <div
            key={brand}
            className="h-10 px-6 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-bold text-sm"
          >
            {brand}
          </div>
        ))}
      </div>
    </section>
  );
}
