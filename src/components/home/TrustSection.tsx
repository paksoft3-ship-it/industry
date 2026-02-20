import MaterialIcon from "@/components/ui/MaterialIcon";

const trustBadges = [
  { title: "Kaliteli Ürünler", description: "Orijinal ve sertifikalı ürünler ile güvenli alışveriş.", icon: "verified" },
  { title: "Hızlı Teslimat", description: "Stokta olan ürünlerde aynı gün kargo ile hızlı teslimat.", icon: "local_shipping" },
  { title: "Teknik Destek", description: "Uzman mühendislerimizden ücretsiz teknik danışmanlık.", icon: "support_agent" },
];

export default function TrustSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {trustBadges.map((badge) => (
        <div
          key={badge.title}
          className="bg-blue-50/50 rounded-xl p-8 border border-blue-100 flex flex-col items-start gap-4"
        >
          <div className="bg-white p-3 rounded-lg shadow-sm text-primary">
            <MaterialIcon icon={badge.icon} className="text-3xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-display)]">
              {badge.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {badge.description}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
