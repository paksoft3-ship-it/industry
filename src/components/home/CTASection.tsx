import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 bg-primary-dark relative overflow-hidden rounded-2xl">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-20" />
      <div className="absolute bottom-0 left-0 w-1/4 h-full bg-white/5 -skew-x-12 -translate-x-10" />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight font-[family-name:var(--font-display)]">
          Özel Projeleriniz İçin Teklif Alın
        </h2>
        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
          Büyük ölçekli üretim veya özel otomasyon sistemleri için mühendis
          ekibimizle iletişime geçin. Size özel çözümler ve kurumsal
          fiyatlandırma sunalım.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="#"
            className="px-8 py-3.5 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Teklif İste
          </Link>
          <Link
            href="#"
            className="px-8 py-3.5 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
          >
            Bize Ulaşın
          </Link>
        </div>
      </div>
    </section>
  );
}
