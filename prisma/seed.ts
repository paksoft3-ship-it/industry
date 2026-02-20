import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── SITE SETTINGS ────────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteName: "CNC Otomasyon",
      siteDescription: "Endüstriyel Otomasyonda Güvenilir Çözüm Ortağınız",
      phone: "+90 212 555 00 00",
      whatsapp: "+90 555 555 55 55",
      email: "info@cncotomasyon.com",
      address: "İkitelli OSB Mah. Marmara Sanayi Sitesi M Blok No:12 Başakşehir / İstanbul",
      workingHours: "Pzt-Cum: 09:00 - 18:00",
      facebookUrl: "#",
      instagramUrl: "#",
      linkedinUrl: "#",
      youtubeUrl: "#",
      dosyaMerkeziSlug: "dosya-merkezi",
      defaultCurrency: "TRY",
      logoUrl: "/images/sivtech_makina_horizontal.png",
    },
  });
  console.log("  ✓ Site settings");

  // ─── ADMIN USER ───────────────────────────────────────
  await prisma.user.upsert({
    where: { email: "admin@cncotomasyon.com" },
    update: {},
    create: {
      email: "admin@cncotomasyon.com",
      passwordHash: hashSync("admin123", 12),
      firstName: "Admin",
      lastName: "CNC",
      role: "SUPER_ADMIN",
      emailVerified: true,
    },
  });
  console.log("  ✓ Admin user (admin@cncotomasyon.com / admin123)");

  // ─── L1 CATEGORIES ───────────────────────────────────
  const l1Categories = [
    { name: "Sigma Profil", slug: "sigma-profil", icon: "view_column", sortOrder: 1 },
    { name: "Elektronik", slug: "elektronik", icon: "developer_board", sortOrder: 2 },
    { name: "Makine | Mekanik", slug: "makine-mekanik", icon: "settings_suggest", sortOrder: 3 },
    { name: "Kızaklar Rulmanlar Vidalı Miller", slug: "lineer-rulmanlar", icon: "linear_scale", sortOrder: 4 },
    { name: "Cnc Router Makineleri Ve Parçaları", slug: "cnc-router", icon: "router", sortOrder: 5 },
    { name: "Eğitim", slug: "egitim", icon: "school", sortOrder: 6 },
  ];

  const l1Map: Record<string, string> = {};
  for (const cat of l1Categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon, sortOrder: cat.sortOrder },
      create: { ...cat, isActive: true },
    });
    l1Map[cat.slug] = created.id;
  }
  console.log("  ✓ L1 categories");

  // ─── L2 CATEGORIES (Sigma Profil) ────────────────────
  const sigmaChildren = [
    { name: "Alüminyum Profiller", slug: "aluminyum-profiller", seoSlug: "sigma-profil-aluminyum-profiller", sortOrder: 1 },
    { name: "Köşe Bağlantı Çeşitleri", slug: "kose-baglanti", seoSlug: "sigma-profil-kose-baglanti", sortOrder: 2 },
    { name: "Kanal Somun Çeşitleri", slug: "kanal-somun", seoSlug: "sigma-profil-kanal-somun", sortOrder: 3 },
    { name: "Sigma Bağlantı Sacları", slug: "baglanti-saclari", seoSlug: "sigma-profil-baglanti-saclari", sortOrder: 4 },
    { name: "Bağlantı Aksesuarları", slug: "baglanti-aksesuarlari", seoSlug: "sigma-profil-baglanti-aksesuarlari", sortOrder: 5 },
    { name: "Civata Çeşitleri Metrik", slug: "civata-cesitleri", seoSlug: "sigma-profil-civata-cesitleri", sortOrder: 6 },
    { name: "Makine Aksesuarları", slug: "sigma-makine-aksesuarlari", seoSlug: "sigma-profil-makine-aksesuarlari", sortOrder: 7 },
  ];

  for (const sub of sigmaChildren) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: { name: sub.name, sortOrder: sub.sortOrder },
      create: { ...sub, parentId: l1Map["sigma-profil"], icon: "view_column", isActive: true },
    });
  }

  // ─── L2 CATEGORIES (Elektronik) ──────────────────────
  const elektronikChildren = [
    { name: "Güç Kaynakları ve Smps Çeşitleri", slug: "guc-kaynaklari", seoSlug: "elektronik-guc-kaynaklari", icon: "power", sortOrder: 1 },
    { name: "Mach3 - Kontrol Paneli", slug: "mach3-kontrol", seoSlug: "elektronik-mach3-kontrol", icon: "memory", sortOrder: 2 },
    { name: "Spindle Motor Ve Sürücüler", slug: "spindle-motorlar", seoSlug: "elektronik-spindle-motor", icon: "cyclone", sortOrder: 3 },
    { name: "Step Motor | Sürücü", slug: "step-motor-surucu", seoSlug: "elektronik-step-motor", icon: "electric_car", sortOrder: 4 },
    { name: "Servo Motor ve Sürücüleri", slug: "servo-motor", seoSlug: "elektronik-servo-motor", icon: "settings_motion_mode", sortOrder: 5 },
    { name: "Hız Kontrol Cihazları", slug: "hiz-kontrol", seoSlug: "elektronik-hiz-kontrol", icon: "speed", sortOrder: 6 },
    { name: "Vakum Pompası Çeşitleri", slug: "vakum-pompasi", seoSlug: "elektronik-vakum-pompasi", icon: "air", sortOrder: 7 },
    { name: "Makine Ekipmanları", slug: "makine-ekipmanlari", seoSlug: "elektronik-makine-ekipmanlari", icon: "build", sortOrder: 8 },
    { name: "Otomatik Yağlama Çeşitleri", slug: "otomatik-yaglama", seoSlug: "elektronik-otomatik-yaglama", icon: "opacity", sortOrder: 9 },
    { name: "Sensör Ve Siviç Çeşitleri", slug: "sensor-switch", seoSlug: "elektronik-sensor-switch", icon: "sensors", sortOrder: 10 },
  ];

  const l2Map: Record<string, string> = {};
  for (const sub of elektronikChildren) {
    const created = await prisma.category.upsert({
      where: { slug: sub.slug },
      update: { name: sub.name, sortOrder: sub.sortOrder },
      create: { ...sub, parentId: l1Map["elektronik"], isActive: true },
    });
    l2Map[sub.slug] = created.id;
  }

  // ─── L2 CATEGORIES (Makine | Mekanik) ────────────────
  const makineChildren = [
    { name: "Vidalı Mil Ve Somun Çeşitleri", slug: "vidali-mil-somun", seoSlug: "makine-vidali-mil-somun", icon: "handyman", sortOrder: 1 },
    { name: "Kremayer Dişli Çeşitleri", slug: "kremayer-disli", seoSlug: "makine-kremayer-disli", icon: "settings", sortOrder: 2 },
    { name: "Planet Redüktör Çeşitleri", slug: "planet-reduktor", seoSlug: "makine-planet-reduktor", icon: "settings_suggest", sortOrder: 3 },
    { name: "Hareketli Kablo Kanalı", slug: "kablo-kanali", seoSlug: "makine-hareketli-kablo-kanali", icon: "cable", sortOrder: 4 },
    { name: "Konik Kilit Çeşitleri", slug: "konik-kilit", seoSlug: "makine-konik-kilit", icon: "lock", sortOrder: 5 },
    { name: "Teknik El Aletleri Çeşitleri", slug: "teknik-el-aletleri", seoSlug: "makine-teknik-el-aletleri", icon: "construction", sortOrder: 6 },
    { name: "Torna Aynası Sanou", slug: "torna-aynasi", seoSlug: "makine-torna-aynasi", icon: "adjust", sortOrder: 7 },
    { name: "Triger Dişli Kasnak", slug: "triger-disli-kasnak", seoSlug: "makine-triger-disli-kasnak", icon: "settings", sortOrder: 8 },
    { name: "Zincir Dişli", slug: "zincir-disli", seoSlug: "makine-zincir-disli", icon: "link", sortOrder: 9 },
  ];

  for (const sub of makineChildren) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: { name: sub.name, sortOrder: sub.sortOrder },
      create: { ...sub, parentId: l1Map["makine-mekanik"], isActive: true },
    });
  }

  // ─── L2 CATEGORIES (Kızaklar Rulmanlar) ──────────────
  const lineerChildren = [
    { name: "Lineer Kızaklar Ve Rulmanları", slug: "lineer-kizak", seoSlug: "lineer-kizaklar-rulmanlari", icon: "linear_scale", sortOrder: 1 },
    { name: "Alt Destekli Mil Ve Rulmanları", slug: "alt-destekli-mil", seoSlug: "lineer-alt-destekli-mil", icon: "linear_scale", sortOrder: 2 },
    { name: "İndüksiyonlu Mil ve Rulmanları", slug: "induksiyonlu-mil", seoSlug: "lineer-induksiyonlu-mil", icon: "linear_scale", sortOrder: 3 },
    { name: "Döküm Yataklar", slug: "dokum-yataklar", seoSlug: "lineer-dokum-yataklar", icon: "adjust", sortOrder: 4 },
    { name: "Lineer Rulman", slug: "lineer-rulman", seoSlug: "lineer-rulman-cesitleri", icon: "radio_button_unchecked", sortOrder: 5 },
    { name: "Mafsal Kafa", slug: "mafsal-kafa", seoSlug: "lineer-mafsal-kafa", icon: "pivot_table_chart", sortOrder: 6 },
    { name: "Vidalı Mil Uç Yatakları Çeşitleri", slug: "vidali-mil-uc-yataklari", seoSlug: "lineer-vidali-mil-uc-yataklari", icon: "handyman", sortOrder: 7 },
    { name: "Motor Bağlantı Setleri", slug: "motor-baglanti-setleri", seoSlug: "lineer-motor-baglanti-setleri", icon: "settings", sortOrder: 8 },
    { name: "Rulmanlar", slug: "rulmanlar", seoSlug: "lineer-rulmanlar-cesitleri", icon: "radio_button_unchecked", sortOrder: 9 },
  ];

  for (const sub of lineerChildren) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: { name: sub.name, sortOrder: sub.sortOrder },
      create: { ...sub, parentId: l1Map["lineer-rulmanlar"], isActive: true },
    });
  }

  // ─── L2 CATEGORIES (CNC Router) ──────────────────────
  const cncRouterChildren = [
    { name: "Büyük Cnc Router", slug: "buyuk-cnc-router", seoSlug: "cnc-router-buyuk", icon: "router", sortOrder: 1 },
    { name: "Cnc Router Ekonomik", slug: "ekonomik-cnc-router", seoSlug: "cnc-router-ekonomik", icon: "router", sortOrder: 2 },
    { name: "Mini Cnc Router", slug: "mini-cnc-router", seoSlug: "cnc-router-mini", icon: "router", sortOrder: 3 },
    { name: "4 Eksen Setleri", slug: "4-eksen-setleri", seoSlug: "cnc-router-4-eksen-setleri", icon: "settings", sortOrder: 4 },
    { name: "Cnc Uç Çeşitleri", slug: "cnc-uc-cesitleri", seoSlug: "cnc-router-uc-cesitleri", icon: "build", sortOrder: 5 },
    { name: "Toz Emme Kafası", slug: "toz-emme-kafasi", seoSlug: "cnc-router-toz-emme-kafasi", icon: "air", sortOrder: 6 },
    { name: "Uç Soğutucu", slug: "uc-sogutucu", seoSlug: "cnc-router-uc-sogutucu", icon: "ac_unit", sortOrder: 7 },
    { name: "Z Ekseni Modülleri", slug: "z-ekseni-modulleri", seoSlug: "cnc-router-z-ekseni-modulleri", icon: "height", sortOrder: 8 },
  ];

  for (const sub of cncRouterChildren) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: { name: sub.name, sortOrder: sub.sortOrder },
      create: { ...sub, parentId: l1Map["cnc-router"], isActive: true },
    });
  }

  // ─── L2 CATEGORIES (Eğitim) ──────────────────────────
  const egitimChildren = [
    { name: "Servo Motor Eğitimleri", slug: "egitim-servo-motor", sortOrder: 1 },
    { name: "Step Motor Eğitimleri", slug: "egitim-step-motor", sortOrder: 2 },
    { name: "Diğer Otomasyon Eğitimleri", slug: "egitim-diger-otomasyon", sortOrder: 3 },
    { name: "Sigma Profil Eğitimleri", slug: "egitim-sigma-profil", sortOrder: 4 },
    { name: "Lineer Kızak ve Rulman Eğitimleri", slug: "egitim-lineer-rulman", sortOrder: 5 },
    { name: "Vidalı Mil ve Somunlar Eğitimleri", slug: "egitim-vidali-mil", sortOrder: 6 },
    { name: "Spindle Motor Eğitimleri", slug: "egitim-spindle-motor", sortOrder: 7 },
    { name: "Cnc Router Eğitimleri", slug: "egitim-cnc-router", sortOrder: 8 },
    { name: "Blower Vakum Motoru Eğitimleri", slug: "egitim-blower-vakum", sortOrder: 9 },
    { name: "Hız Kontrol Cihazı İnverter Eğitimleri", slug: "egitim-hiz-kontrol", sortOrder: 10 },
    { name: "Cnc Kontrol Ünitesi Ve Mach3 Eğitimleri", slug: "egitim-cnc-kontrol", sortOrder: 11 },
    { name: "Planet Redüktör Eğitimleri", slug: "egitim-planet-reduktor", sortOrder: 12 },
  ];

  for (const sub of egitimChildren) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: { name: sub.name, sortOrder: sub.sortOrder },
      create: { ...sub, parentId: l1Map["egitim"], icon: "school", isActive: true },
    });
  }
  console.log("  ✓ L2 categories");

  // ─── L3 CATEGORIES (Servo Motor children) ──────────
  const servoL3 = [
    { name: "130 Flanş Servo Motor", slug: "130-flans-servo-motor", seoSlug: "130-flans-servo-motor", sortOrder: 1 },
    { name: "Frenli Servo Motor", slug: "frenli-servo-motor", seoSlug: "frenli-servo-motor", sortOrder: 2 },
    { name: "AC Servo Motor", slug: "ac-servo-motor", seoSlug: "ac-servo-motor", sortOrder: 3 },
  ];
  for (const sub of servoL3) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: { name: sub.name, sortOrder: sub.sortOrder },
      create: { ...sub, parentId: l2Map["servo-motor"], icon: "settings_motion_mode", isActive: true },
    });
  }

  // ─── L3 CATEGORIES (Güç Kaynakları children) ───────
  const gucL3 = [
    { name: "SMPS Güç Kaynakları", slug: "smps-guc-kaynaklari", seoSlug: "smps-guc-kaynaklari", sortOrder: 1 },
  ];
  for (const sub of gucL3) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: { name: sub.name, sortOrder: sub.sortOrder },
      create: { ...sub, parentId: l2Map["guc-kaynaklari"], icon: "power", isActive: true },
    });
  }

  // ─── L3 CATEGORIES (Vakum Pompası children) ────────
  const vakumL3 = [
    { name: "Blower Motorlar", slug: "blower-motorlar", seoSlug: "blower-motorlar", sortOrder: 1 },
  ];
  for (const sub of vakumL3) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: { name: sub.name, sortOrder: sub.sortOrder },
      create: { ...sub, parentId: l2Map["vakum-pompasi"], icon: "air", isActive: true },
    });
  }
  console.log("  ✓ L3 categories");

  // ─── BRANDS ──────────────────────────────────────────
  const brands = [
    { name: "Mermak", slug: "mermak" },
    { name: "Hiwin", slug: "hiwin" },
    { name: "TBI Motion", slug: "tbi-motion" },
    { name: "Delta", slug: "delta" },
    { name: "Leadshine", slug: "leadshine" },
    { name: "Artsoft", slug: "artsoft" },
  ];

  const brandMap: Record<string, string> = {};
  for (const brand of brands) {
    const created = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: { ...brand, isActive: true },
    });
    brandMap[brand.slug] = created.id;
  }
  console.log("  ✓ Brands");

  // ─── SAMPLE PRODUCTS ─────────────────────────────────
  const sampleProducts = [
    {
      name: "2.2kW Su Soğutmalı Spindle Motor",
      slug: "spindle-motor-2-2kw",
      sku: "SP-22KW-W",
      description: "Profesyonel CNC uygulamaları için tasarlanmış 2.2kW su soğutmalı spindle motor. Yüksek devir ve düşük titreşim ile mükemmel yüzey kalitesi sağlar.",
      price: 3850,
      compareAtPrice: 4500,
      brandSlug: "mermak",
      inStock: true,
      stockCount: 15,
      badge: "Stokta",
      badgeColor: "orange",
      isFeatured: true,
      categorySlug: "spindle-motorlar",
      images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuCTNTnRusniCBJVR-tvCFhPUtAASWDBh4XMyA_97_LrAuaNtroCwfk4OWkdUCFbB8jd7wduSotLaiwihwly3afYwvJfk7lsVDnNyhkECAayomyMIaBjB3cFr3SZzVM0CT4m2lSuEruTM-JJ_0_bwdJR0u1jOxx9pKkjZmqrWNtSegufi_-j9A29uLbphsHdPo371EKYi20WqBti_HUKswWyypjQUEyolANtG7GiwwvW8dA5gsNvAapi222gaZy4dRSwGdZPn3fSIDMo"],
      attributes: { "Güç": "2.2kW", "Devir": "24000 RPM", "Soğutma": "Su Soğutmalı", "Pens Tipi": "ER20", "Rulman": "4 Adet Seramik", "Voltaj": "220V AC", "Ağırlık": "5.2 kg" },
    },
    {
      name: "Nema 23 Step Motor 2.2Nm",
      slug: "nema-23-step-motor",
      sku: "SM-23-220",
      description: "Nema 23 boyutunda yüksek torklu step motor. CNC router, 3D yazıcı ve otomasyon projeleri için ideal.",
      price: 450,
      compareAtPrice: 530,
      brandSlug: "leadshine",
      inStock: true,
      stockCount: 120,
      badge: null,
      badgeColor: null,
      isFeatured: true,
      categorySlug: "step-motor-surucu",
      images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBxBMe5YzF9tJdqurEmFyG8Zk-XehjW6roDyNpHgH5CDxZbwyw7_kK61M_25nBkGSHyyqXfaf7VuXBmu1H70YtN1_iPD4rSGCHWTnTMmVOA9rpXQ4rHPwm9vukgnnnk9cKR_IymUbO0gaJ3Whk8NVo3-1ja0pzYdDr5oLwFKufuEIap1hXvcW2pTU9WVtuEFjWsNSJQZIQXF2LnowQM9DSWRRbeQZokKp8iKEP9jKx_5zpIyfH7kNKiSrwuIT_MQQVeTUwhLNwVO6WG"],
      attributes: { "Tork": "2.2Nm", "Akım": "3.0A", "Adım Açısı": "1.8°", "Kablo": "8 Kablolu", "Boyut": "57x57x82mm", "Mil Çapı": "8mm", "Ağırlık": "1.05 kg" },
    },
    {
      name: "Mach3 USB Kontrol Kartı 4 Eksen",
      slug: "mach3-kontrol-karti",
      sku: "CK-M3-4X",
      description: "4 eksen USB kontrol kartı. Mach3 yazılımı ile tam uyumlu, kolay kurulum ve yüksek performans.",
      price: 850,
      compareAtPrice: null,
      brandSlug: "artsoft",
      inStock: true,
      stockCount: 35,
      badge: "Yeni",
      badgeColor: "blue",
      isFeatured: true,
      categorySlug: "mach3-kontrol",
      images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDqN-an9iI13KYO8DKaZBwMkrx5j0cBvYgguASVSu7TuIJVdgt6RffQl7eXrByv0Oy-8cSMWW8L2wI8n8MANu1ubkYX9HZFPHfa26yJ6mHX5WQyhJ46Md1KI58hPROxIyZvviBAGZuWtsJog-cirJO9iv_PiPfN_9kL2_Ub1ErBUJ6ePow8ZQ-QwWQqWcgqgmkC6R-Ni_jJUTcuniWvW3y4j9MJ5v74aNplgQ_Lhr938moIPs6El4UZp1IFrr1NmsINhkWv-6WC3kYv"],
      attributes: { "Eksen": "4 Eksen", "Frekans": "100KHz", "Bağlantı": "USB 2.0", "Uyumluluk": "Mach3 / Mach4", "İşletim Sistemi": "Windows 7/10/11", "Giriş/Çıkış": "12 Giriş / 8 Çıkış" },
    },
    {
      name: "HGR20 Lineer Ray (100cm)",
      slug: "hgr20-lineer-ray",
      sku: "LR-HGR20-100",
      description: "HGR20 tipi lineer ray, yüksek hassasiyet ve ağır yük kapasitesi ile CNC makineleri için ideal.",
      price: 1200,
      compareAtPrice: null,
      brandSlug: "hiwin",
      inStock: true,
      stockCount: 3,
      badge: "Yeni",
      badgeColor: "blue",
      isFeatured: true,
      categorySlug: "lineer-kizak",
      images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuD3MWdP7npbt_DrEKnF3uqbrLzvAaJDNobPaVg8Igop6ka_RReHBVEgrbzzdlm4aaX-qT6cg8CPhc3-qKVw3bsm4wCh4ZCS6uBTvFrmnpgIrwmdnSe2yM40hf5QOvZ3FCeMzSW1WxETDbf6SGqMUuCWD2J2_W0qwxAz4hrX3t7Z7dV6r8d_5auMFIrAQyQSC0xpDABspvw61lwEsaNaJTJVc41xQKiRHsZskCx1wrwF9OLS39oJrksUsA1vito3U3Ft61Yb_L70o-ka"],
      attributes: { "Tip": "HGR20", "Uzunluk": "1000mm", "Hassasiyet": "H Sınıfı", "Yük Kapasitesi": "2800N", "Malzeme": "Sertleştirilmiş Çelik", "Yüzey": "Krom Kaplama" },
    },
    {
      name: "AC Servo Motor 750W Sürücülü Set",
      slug: "servo-motor-750w",
      sku: "SV-750W-SET",
      description: "Yüksek performanslı AC servo motor ve sürücü seti. Hassas pozisyon kontrolü gerektiren uygulamalar için.",
      price: 5200,
      compareAtPrice: 5800,
      brandSlug: "delta",
      inStock: true,
      stockCount: 8,
      badge: "Kampanya",
      badgeColor: "red",
      isFeatured: true,
      categorySlug: "servo-motor",
      images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDjYYL-ucytbVuGW5nxU4yFgbFwcBmO3VWSiMbsTqmQx7bdv1ngMZeTWzixIVfkU0o_vcl7Qf_fbJ3PEv545o9aWLeCGzOQIZL94XHe3ORaSgEmmCuLvxP7zVd_KMLVpzXxyHT3BKZX08ThsG1OoRgWeV2qNpvzzrb4gJV1qQ7KTD-Su_-86V53CQjC1TJMnjJH-BPFSUppHU9zK1zx00y7_YTF0PLurMw1XFrpdoG9PqSZDQ3_wQ9bUVAXAyNg7DRD0aEOMdkWobGA"],
      attributes: { "Güç": "750W", "Tork": "2.4Nm", "Devir": "3000RPM", "Encoder": "2500PPR", "Voltaj": "220V AC", "Ağırlık": "3.8 kg" },
    },
    {
      name: "SFS1605 Bilyalı Vida Seti 500mm",
      slug: "bilyali-vida-sfs1605",
      sku: "BV-1605-500",
      description: "SFS1605 bilyalı vida ve somun seti. İşlenmiş uçlar ve somun dahil.",
      price: 980,
      compareAtPrice: null,
      brandSlug: "tbi-motion",
      inStock: true,
      stockCount: 22,
      badge: null,
      badgeColor: null,
      isFeatured: true,
      categorySlug: "vidali-mil-somun",
      images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBiyJGxlBxRSFMgG3OxKbKWrraTxuR1fFrkv9jho-uMMEuiqDVPw9MTvQYi_OqpBNU3hz9QzbFyZZlYmtfnDIn6O_L2ybG8vsT1guhjqf_uBJmJPoWN8gvQyOqy4A6kcBSR9RQNH8J6JK648yIGXP4O3ESYo1nU3ui07mErfObSJ23hJP4ACLH6iUuaQdr47exwSdV0I-XhHV-P4QG11FI3o8LnrnEyzUj6syeoUEY3dRZqP89M7xYMht3_Q-M5x0Z3A7luduI9Y9-p"],
      attributes: { "Çap": "16mm", "Hatve": "5mm", "Uzunluk": "500mm", "Hassasiyet": "C7", "Malzeme": "SCM415", "Ağırlık": "1.2 kg" },
    },
  ];

  for (const p of sampleProducts) {
    const { images, attributes, categorySlug, brandSlug, ...productData } = p;

    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    const brandId = brandSlug ? brandMap[brandSlug] : undefined;

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...productData,
        brandId: brandId || null,
        price: productData.price,
        compareAtPrice: productData.compareAtPrice,
      },
    });

    // Images
    const existingImages = await prisma.productImage.count({ where: { productId: product.id } });
    if (existingImages === 0) {
      for (let i = 0; i < images.length; i++) {
        await prisma.productImage.create({
          data: { productId: product.id, url: images[i], alt: p.name, sortOrder: i },
        });
      }
    }

    // Attributes
    const existingAttrs = await prisma.productAttribute.count({ where: { productId: product.id } });
    if (existingAttrs === 0) {
      for (const [key, value] of Object.entries(attributes)) {
        await prisma.productAttribute.create({
          data: { productId: product.id, key, value },
        });
      }
    }

    // Category link
    if (category) {
      await prisma.productCategory.upsert({
        where: { productId_categoryId: { productId: product.id, categoryId: category.id } },
        update: {},
        create: { productId: product.id, categoryId: category.id },
      });
    }
  }
  console.log("  ✓ Sample products (6)");

  // ─── BLOG CATEGORIES ─────────────────────────────────
  const blogCategories = [
    { name: "CNC Eğitimleri", slug: "cnc-egitimleri", rootSlug: "blog-cnc-egitimleri" },
    { name: "Otomasyon Rehberleri", slug: "otomasyon-rehberleri", rootSlug: "blog-otomasyon-rehberleri" },
    { name: "Ürün İncelemeleri", slug: "urun-incelemeleri", rootSlug: "blog-urun-incelemeleri" },
    { name: "Sektör Haberleri", slug: "sektor-haberleri", rootSlug: "blog-sektor-haberleri" },
  ];

  for (const bc of blogCategories) {
    await prisma.blogCategory.upsert({
      where: { slug: bc.slug },
      update: {},
      create: bc,
    });
  }
  console.log("  ✓ Blog categories");

  // ─── FILE LIBRARY ────────────────────────────────────
  const files = [
    { title: "NEMA 23 Step Motor Teknik Çizim", category: "Teknik Çizimler", fileUrl: "#", fileType: "PDF", fileSize: "2.4 MB", icon: "picture_as_pdf" },
    { title: "2.2kW Spindle Motor Kullanım Kılavuzu", category: "Kullanım Kılavuzları", fileUrl: "#", fileType: "PDF", fileSize: "5.1 MB", icon: "picture_as_pdf" },
    { title: "Mach3 Kontrol Kartı Kurulum Rehberi", category: "Kurulum Rehberleri", fileUrl: "#", fileType: "PDF", fileSize: "3.8 MB", icon: "picture_as_pdf" },
    { title: "HGR20 Lineer Ray CAD Dosyası", category: "CAD Dosyaları", fileUrl: "#", fileType: "STEP", fileSize: "12.6 MB", icon: "view_in_ar" },
    { title: "Servo Sürücü Parametreleme Yazılımı", category: "Yazılımlar", fileUrl: "#", fileType: "ZIP", fileSize: "45.2 MB", icon: "folder_zip" },
    { title: "CNC 4 Eksen Bağlantı Şeması", category: "Teknik Çizimler", fileUrl: "#", fileType: "DWG", fileSize: "1.8 MB", icon: "architecture" },
  ];

  for (const f of files) {
    const existing = await prisma.fileLibrary.findFirst({ where: { title: f.title } });
    if (!existing) {
      await prisma.fileLibrary.create({ data: f });
    }
  }
  console.log("  ✓ File library");

  // ─── STATIC PAGES ────────────────────────────────────
  const staticPages = [
    { title: "Hakkımızda", slug: "hakkimizda", content: "<p>CNC Otomasyon hakkında bilgi sayfası.</p>" },
    { title: "Sıkça Sorulan Sorular", slug: "sss", content: "<p>Sıkça sorulan sorular.</p>" },
    { title: "Banka Hesaplarımız", slug: "banka-bilgilerimiz", content: "<p>Banka hesap bilgilerimiz.</p>" },
    { title: "İade ve Değişim", slug: "iade-degisim", content: "<p>İade ve değişim koşulları.</p>" },
    { title: "Kargo ve Teslimat", slug: "kargo-teslimat", content: "<p>Kargo ve teslimat bilgileri.</p>" },
    { title: "Gizlilik Politikası", slug: "gizlilik-politikasi", content: "<p>Gizlilik politikası.</p>" },
    { title: "Mesafeli Satış Sözleşmesi", slug: "mesafeli-satis-sozlesmesi", content: "<p>Mesafeli satış sözleşmesi.</p>" },
  ];

  for (const page of staticPages) {
    await prisma.staticPage.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }
  console.log("  ✓ Static pages");

  // ─── COUPONS ──────────────────────────────────────────
  await prisma.coupon.upsert({
    where: { code: "HOSGELDIN10" },
    update: {},
    create: {
      code: "HOSGELDIN10",
      description: "Yeni üye hoş geldin kuponu - %10 indirim",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 500,
      isActive: true,
      expiresAt: new Date("2026-12-31"),
    },
  });
  console.log("  ✓ Coupons");

  console.log("\n✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
