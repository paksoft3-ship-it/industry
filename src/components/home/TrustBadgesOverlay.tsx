import MaterialIcon from "@/components/ui/MaterialIcon";

const trustBadgesHome = [
  { title: "Hızlı Kargo", description: "Aynı gün kargo imkanı", icon: "local_shipping" },
  { title: "Güvenli Ödeme", description: "256-bit SSL şifreleme", icon: "security" },
  { title: "Teknik Destek", description: "Uzman mühendis desteği", icon: "support_agent" },
];

export default function TrustBadgesOverlay() {
  return (
    <section className="bg-white border-b border-[#e7ebf4] relative z-30 -mt-8 mx-4 sm:mx-8 lg:mx-auto max-w-[1200px] rounded-xl shadow-xl shadow-slate-200/50">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {trustBadgesHome.map((badge, i) => (
          <div
            key={badge.title}
            className={`flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors ${
              i === 0
                ? "rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                : i === trustBadgesHome.length - 1
                ? "rounded-b-xl md:rounded-r-xl md:rounded-bl-none"
                : ""
            }`}
          >
            <div className="size-12 rounded-full bg-blue-50 text-primary flex items-center justify-center flex-shrink-0">
              <MaterialIcon icon={badge.icon} />
            </div>
            <div>
              <h3 className="font-bold text-text-main">{badge.title}</h3>
              <p className="text-sm text-gray-500">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
