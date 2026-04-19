import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const pages = [
  {
    title: "Gizlilik Politikası",
    slug: "gizlilik-politikasi",
    seoTitle: "Gizlilik Politikası | SivTech Makina",
    seoDesc: "SivTech Makina gizlilik politikası ve kişisel veri koruma hakkında bilgiler.",
    isActive: true,
    content: `<h2>Gizlilik Politikası</h2>
<p>SivTech Makina İmalat İthalat İhracat Ticaret ve Sanayi Ltd. Şti. olarak, müşterilerimizin ve web sitemizi ziyaret eden tüm kullanıcıların gizliliğini korumak öncelikli hedefimizdir.</p>

<h3>Toplanan Bilgiler</h3>
<p>Web sitemizi ziyaret ettiğinizde, sipariş verdiğinizde veya bizimle iletişime geçtiğinizde aşağıdaki bilgiler toplanabilir:</p>
<ul>
  <li>Ad, soyad, e-posta adresi ve telefon numarası gibi iletişim bilgileri</li>
  <li>Teslimat ve fatura adresleri</li>
  <li>Sipariş geçmişi ve satın alma bilgileri</li>
  <li>IP adresi ve tarayıcı bilgileri (çerezler aracılığıyla)</li>
</ul>

<h3>Bilgilerin Kullanımı</h3>
<p>Topladığımız bilgiler yalnızca şu amaçlarla kullanılmaktadır:</p>
<ul>
  <li>Siparişlerinizi işlemek ve teslimata hazırlamak</li>
  <li>Müşteri hizmetleri sunmak</li>
  <li>Yasal yükümlülüklerimizi yerine getirmek</li>
  <li>Hizmetlerimizi geliştirmek</li>
</ul>

<h3>Bilgilerin Paylaşımı</h3>
<p>Kişisel bilgileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz. Kargo teslimatı için yalnızca gerekli bilgiler ilgili lojistik firmasına iletilir.</p>

<h3>Güvenlik</h3>
<p>Kişisel verilerinizi korumak için endüstri standardı güvenlik önlemleri uygulanmaktadır. SSL şifreleme teknolojisi kullanılarak veri iletimi güvenli hale getirilmiştir.</p>

<h3>İletişim</h3>
<p>Gizlilik politikamız hakkında sorularınız için <strong>sivtechmakina@gmail.com</strong> adresine e-posta gönderebilirsiniz.</p>`,
  },
  {
    title: "KVKK Aydınlatma Metni",
    slug: "kvkk-aydinlatma-metni",
    seoTitle: "KVKK Aydınlatma Metni | SivTech Makina",
    seoDesc: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.",
    isActive: true,
    content: `<h2>Kişisel Verilerin Korunması Kanunu (KVKK) Aydınlatma Metni</h2>
<p>Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 10. maddesi uyarınca hazırlanmıştır.</p>

<h3>Veri Sorumlusu</h3>
<p><strong>SivTech Makina İmalat İthalat İhracat Ticaret ve Sanayi Ltd. Şti.</strong><br>
Gültepe Mahallesi 11. Sanayi Sok. 36/H Merkez/SİVAS<br>
Vergi No: 7721512290 | Vergi Dairesi: SİTE<br>
E-posta: sivtechmakina@gmail.com</p>

<h3>İşlenen Kişisel Veriler</h3>
<ul>
  <li><strong>Kimlik Verileri:</strong> Ad, soyad, T.C. kimlik numarası</li>
  <li><strong>İletişim Verileri:</strong> Telefon numarası, e-posta adresi, adres bilgileri</li>
  <li><strong>Finans Verileri:</strong> Fatura bilgileri, ödeme yöntemi bilgileri</li>
  <li><strong>İşlem Güvenliği Verileri:</strong> IP adresi, oturum bilgileri</li>
  <li><strong>Pazarlama Verileri:</strong> Çerez kayıtları, satın alma geçmişi</li>
</ul>

<h3>Kişisel Verilerin İşlenme Amaçları</h3>
<ul>
  <li>Sipariş ve teslimat süreçlerinin yönetimi</li>
  <li>Müşteri hizmetleri ve destek faaliyetleri</li>
  <li>Yasal yükümlülüklerin yerine getirilmesi</li>
  <li>Sözleşmelerin ifası</li>
  <li>Pazarlama ve tanıtım faaliyetleri (açık rıza halinde)</li>
</ul>

<h3>Kişisel Verilerin Aktarılması</h3>
<p>Kişisel verileriniz; kargo ve lojistik firmaları, ödeme kuruluşları ve yasal zorunluluk halinde kamu kurum ve kuruluşlarıyla paylaşılabilir.</p>

<h3>Haklarınız</h3>
<p>KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:</p>
<ul>
  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
  <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
  <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
  <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
  <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
  <li>Kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
</ul>
<p>Haklarınızı kullanmak için <strong>sivtechmakina@gmail.com</strong> adresine başvurabilirsiniz.</p>`,
  },
  {
    title: "Kullanım Koşulları",
    slug: "kullanim-kosullari",
    seoTitle: "Kullanım Koşulları | SivTech Makina",
    seoDesc: "SivTech Makina web sitesi kullanım koşulları ve şartları.",
    isActive: true,
    content: `<h2>Kullanım Koşulları</h2>
<p>Bu web sitesini kullanarak aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız. Lütfen bu koşulları dikkatlice okuyunuz.</p>

<h3>1. Genel Bilgiler</h3>
<p>Bu web sitesi, SivTech Makina İmalat İthalat İhracat Ticaret ve Sanayi Ltd. Şti. tarafından işletilmektedir. Sitemizde sunulan ürün ve hizmetlere erişim ve kullanım bu koşullara tabidir.</p>

<h3>2. Fikri Mülkiyet Hakları</h3>
<p>Bu web sitesindeki tüm içerik (metinler, görseller, logolar, tasarımlar) SivTech Makina'ya aittir ve telif hukuku ile korunmaktadır. İzin alınmaksızın kopyalanamaz, dağıtılamaz veya ticari amaçlarla kullanılamaz.</p>

<h3>3. Ürün Bilgileri</h3>
<p>Web sitemizde yer alan ürün açıklamaları ve fiyat bilgileri önceden haber verilmeksizin değiştirilebilir. Stok durumu ve fiyatlar sipariş anında geçerli olan bilgilere göre belirlenir.</p>

<h3>4. Sorumluluk Sınırlaması</h3>
<p>SivTech Makina, web sitesinin kesintisiz ve hatasız çalışacağını garanti etmez. Teknik arızalar, güncellemeler veya bakım çalışmaları nedeniyle erişim geçici olarak kesilebilir.</p>

<h3>5. Bağlantılı Web Siteleri</h3>
<p>Web sitemizden üçüncü taraf web sitelerine bağlantılar verilebilir. Bu sitelerin içerik ve güvenliğinden SivTech Makina sorumlu değildir.</p>

<h3>6. Değişiklikler</h3>
<p>SivTech Makina, bu kullanım koşullarını herhangi bir zamanda değiştirme hakkını saklı tutar. Güncel koşullar web sitesinde yayımlanır.</p>

<h3>7. Uygulanacak Hukuk</h3>
<p>Bu kullanım koşulları Türk Hukuku'na tabidir. Uyuşmazlık halinde Sivas Mahkemeleri ve İcra Daireleri yetkilidir.</p>`,
  },
  {
    title: "Çerez Politikası",
    slug: "cerez-politikasi",
    seoTitle: "Çerez Politikası | SivTech Makina",
    seoDesc: "SivTech Makina web sitesinde kullanılan çerezler hakkında bilgi.",
    isActive: true,
    content: `<h2>Çerez Politikası</h2>
<p>Bu sayfa, web sitemizde kullandığımız çerezler (cookies) hakkında sizi bilgilendirmek amacıyla hazırlanmıştır.</p>

<h3>Çerez Nedir?</h3>
<p>Çerezler, web sitelerinin tarayıcınıza yerleştirdiği küçük metin dosyalarıdır. Web sitemizi ziyaret ettiğinizde deneyiminizi iyileştirmek, tercihleri hatırlamak ve site trafiğini analiz etmek amacıyla çerezler kullanılır.</p>

<h3>Kullandığımız Çerez Türleri</h3>

<h4>Zorunlu Çerezler</h4>
<p>Web sitesinin düzgün çalışabilmesi için gerekli olan çerezlerdir. Oturum bilgileri, sepet içerikleri ve güvenlik doğrulamaları bu kapsamdadır. Bu çerezler devre dışı bırakılamaz.</p>

<h4>İşlevsel Çerezler</h4>
<p>Dil tercihi, oturum açma bilgileri gibi kişiselleştirme ayarlarını hatırlamak için kullanılır. Bu çerezleri devre dışı bırakabilirsiniz ancak bazı özellikler düzgün çalışmayabilir.</p>

<h4>Analitik Çerezler</h4>
<p>Ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardımcı olur (ziyaret sayısı, en çok ziyaret edilen sayfalar vb.). Bu veriler anonimdir ve kimliğinizi tespit etmek için kullanılmaz.</p>

<h4>Pazarlama Çerezleri</h4>
<p>İlgi alanlarınıza uygun reklamlar göstermek amacıyla kullanılır. Açık rızanız olmadan bu çerezler aktif edilmez.</p>

<h3>Çerezleri Nasıl Kontrol Edebilirsiniz?</h3>
<p>Tarayıcı ayarlarınızdan çerezleri yönetebilir veya silebilirsiniz. Aşağıdaki tarayıcı bağlantılarından çerez ayarlarına erişebilirsiniz:</p>
<ul>
  <li>Google Chrome: Ayarlar → Gizlilik ve Güvenlik → Çerezler</li>
  <li>Mozilla Firefox: Seçenekler → Gizlilik ve Güvenlik</li>
  <li>Safari: Tercihler → Gizlilik</li>
  <li>Microsoft Edge: Ayarlar → Gizlilik, Arama ve Hizmetler</li>
</ul>

<h3>İletişim</h3>
<p>Çerez politikamız hakkında sorularınız için <strong>sivtechmakina@gmail.com</strong> adresine ulaşabilirsiniz.</p>`,
  },
  {
    title: "İade ve Değişim Politikası",
    slug: "iade-ve-degisim-politikasi",
    seoTitle: "İade ve Değişim Politikası | SivTech Makina",
    seoDesc: "SivTech Makina iade, değişim ve ürün iade koşulları hakkında bilgi.",
    isActive: true,
    content: `<h2>İade ve Değişim Politikası</h2>
<p>SivTech Makina olarak müşteri memnuniyetini ön planda tutuyoruz. Ürünlerimizle ilgili iade ve değişim taleplerini aşağıdaki koşullar çerçevesinde değerlendiriyoruz.</p>

<h3>İade Koşulları</h3>
<p>Teslim tarihinden itibaren <strong>14 gün</strong> içinde aşağıdaki koşulları sağlayan ürünler iade edilebilir:</p>
<ul>
  <li>Ürün kullanılmamış ve orijinal ambalajında olmalıdır</li>
  <li>Tüm aksesuarlar ve belgeler eksiksiz olmalıdır</li>
  <li>Ürün üzerinde herhangi bir hasar veya deformasyon bulunmamalıdır</li>
  <li>Fatura veya sipariş belgesi ibraz edilmelidir</li>
</ul>

<h3>İade Kabul Edilmeyen Durumlar</h3>
<ul>
  <li>Müşteri tarafından hasar görmüş ürünler</li>
  <li>Özel sipariş veya kişiye özel üretilen ürünler</li>
  <li>Hijyen nedeniyle iade edilemeyen ürünler</li>
  <li>14 günlük iade süresinin dolmuş olduğu durumlar</li>
  <li>Kullanılmış veya ambalajı açılmış ürünler (sağlık ve güvenlik gerekçesiyle)</li>
</ul>

<h3>İade Süreci</h3>
<ol>
  <li>İade talebinizi <strong>sivtechmakina@gmail.com</strong> adresine sipariş numaranızla bildirin</li>
  <li>İade onayı aldıktan sonra ürünü belirtilen adrese gönderin</li>
  <li>Ürün inceleme süresi en fazla 5 iş günüdür</li>
  <li>Onaylanan iade tutarı 10 iş günü içinde ödeme yönteminize iade edilir</li>
</ol>

<h3>Değişim</h3>
<p>Yanlış veya hatalı ürün teslim edilmesi durumunda ücretsiz değişim yapılır. Stok durumuna göre aynı veya eşdeğer ürün gönderilir.</p>

<h3>Garanti Kapsamındaki Arızalar</h3>
<p>Garanti süresi içindeki üretim kaynaklı arızalarda ürün ücretsiz olarak onarılır veya değiştirilir. Garanti koşulları ürün belgelerinde belirtilmiştir.</p>

<h3>İletişim</h3>
<p>İade ve değişim talepleriniz için:<br>
E-posta: <strong>sivtechmakina@gmail.com</strong><br>
Adres: Gültepe Mahallesi 11. Sanayi Sok. 36/H Merkez/SİVAS</p>`,
  },
  {
    title: "Mesafeli Satış Sözleşmesi",
    slug: "mesafeli-satis-sozlesmesi",
    seoTitle: "Mesafeli Satış Sözleşmesi | SivTech Makina",
    seoDesc: "SivTech Makina mesafeli satış sözleşmesi ve yasal haklar.",
    isActive: true,
    content: `<h2>Mesafeli Satış Sözleşmesi</h2>

<h3>MADDE 1 – TARAFLAR</h3>
<p><strong>SATICI:</strong><br>
Unvan: SivTech Makina İmalat İthalat İhracat Ticaret ve Sanayi Ltd. Şti.<br>
Adres: Gültepe Mahallesi 11. Sanayi Sok. 36/H Merkez/SİVAS<br>
Vergi No: 7721512290 | Vergi Dairesi: SİTE<br>
E-posta: sivtechmakina@gmail.com</p>

<p><strong>ALICI:</strong> Sipariş formunda belirtilen bilgilere sahip kişi/kuruluş.</p>

<h3>MADDE 2 – KONU</h3>
<p>Bu sözleşme, ALICI'nın SATICI'ya ait internet sitesi üzerinden elektronik ortamda siparişini verdiği aşağıda belirtilen özellikleri ve satış fiyatı bulunan ürün/ürünlerin satışı ve teslimi ile ilgili olarak 6502 Sayılı Tüketicinin Korunması Hakkındaki Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini kapsar.</p>

<h3>MADDE 3 – SÖZLEŞMENİN KURULMASI</h3>
<p>Sipariş onaylandığı anda bu sözleşme kurulmuş sayılır. Sipariş onayı e-posta yoluyla ALICI'ya iletilir.</p>

<h3>MADDE 4 – TESLİMAT</h3>
<p>Ürünler, sipariş onayından itibaren stok durumuna göre 3-10 iş günü içinde ALICI'nın belirttiği adrese teslim edilir. Olağanüstü durumlarda bu süre uzayabilir; bu durumda ALICI bilgilendirilir.</p>

<h3>MADDE 5 – CAYMA HAKKI</h3>
<p>ALICI, teslim tarihinden itibaren 14 (on dört) gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir. Cayma hakkının kullanılması için yazılı bildirim veya e-posta ile SATICI'ya ulaşılması gerekmektedir.</p>

<h3>MADDE 6 – CAYMA HAKKININ İSTİSNALARI</h3>
<p>Aşağıdaki ürünlerde cayma hakkı kullanılamaz:</p>
<ul>
  <li>Özel sipariş ile üretilen veya kişiye özel hazırlanan ürünler</li>
  <li>Teslimden sonra ambalajı açılan ve iade edilmesi sağlık/hijyen açısından uygun olmayan ürünler</li>
  <li>Hızlı bozulma tehlikesi bulunan ürünler</li>
</ul>

<h3>MADDE 7 – ÖDEME</h3>
<p>Ödeme, sipariş anında seçilen ödeme yöntemi ile gerçekleştirilir. Kredi kartı ile yapılan ödemelerde ilgili banka kampanyaları geçerlidir.</p>

<h3>MADDE 8 – UYUŞMAZLIK ÇÖZÜMÜ</h3>
<p>Sözleşmeden doğan uyuşmazlıklarda Türkiye Cumhuriyeti kanunları uygulanır. Uyuşmazlık halinde Sivas Tüketici Mahkemesi ve Tüketici Hakem Heyeti yetkilidir.</p>`,
  },
  {
    title: "Kargo ve Teslimat",
    slug: "kargo-ve-teslimat",
    seoTitle: "Kargo ve Teslimat Bilgileri | SivTech Makina",
    seoDesc: "SivTech Makina kargo süreleri, teslimat koşulları ve kargo ücretleri hakkında bilgi.",
    isActive: true,
    content: `<h2>Kargo ve Teslimat Bilgileri</h2>
<p>SivTech Makina olarak siparişlerinizi en hızlı ve güvenli şekilde ulaştırmayı hedefliyoruz.</p>

<h3>Teslimat Süreleri</h3>
<ul>
  <li><strong>Stokta olan ürünler:</strong> Sipariş onayından itibaren 1-3 iş günü içinde kargoya verilir</li>
  <li><strong>Stok dışı / özel sipariş ürünler:</strong> Üretim veya tedarik süresine göre bilgilendirme yapılır</li>
  <li><strong>Ağır/hacimli ürünler:</strong> Özel taşıma gerektiren ürünler için ayrıca iletişime geçilir</li>
</ul>

<h3>Kargo Ücretleri</h3>
<ul>
  <li>Belirli bir tutarın üzerindeki siparişlerde kargo ücretsizdir</li>
  <li>Kargo ücreti, sipariş tamamlanmadan önce sepet sayfasında gösterilir</li>
  <li>Ağır ve hacimli ürünlerde ek kargo ücreti uygulanabilir</li>
</ul>

<h3>Teslimat Bölgeleri</h3>
<p>Türkiye'nin tüm illerine teslimat yapılmaktadır. Bazı uzak bölgelere teslimat süresi 1-2 iş günü daha uzayabilir.</p>

<h3>Kargo Takibi</h3>
<p>Siparişiniz kargoya verildiğinde, takip numarası e-posta ile bildirilir. Hesabınıza giriş yaparak sipariş durumunuzu anlık takip edebilirsiniz.</p>

<h3>Hasarlı veya Eksik Teslimat</h3>
<p>Kargo tesliminde ürünü teslim almadan önce kontrol edin. Hasar veya eksiklik durumunda tutanak tutturarak ürünü teslim almayın ve derhal <strong>sivtechmakina@gmail.com</strong> adresine bildirin.</p>

<h3>İletişim</h3>
<p>Kargo ve teslimat ile ilgili sorularınız için:<br>
E-posta: <strong>sivtechmakina@gmail.com</strong><br>
Tel: Web sitemizdeki iletişim bilgilerinden ulaşabilirsiniz.</p>`,
  },
  {
    title: "Hakkımızda",
    slug: "hakkimizda",
    seoTitle: "Hakkımızda | SivTech Makina",
    seoDesc: "SivTech Makina hakkında şirket bilgileri, misyon ve vizyon.",
    isActive: true,
    content: `<h2>Hakkımızda</h2>
<p>SivTech Makina İmalat İthalat İhracat Ticaret ve Sanayi Ltd. Şti., endüstriyel otomasyon ve makina sektöründe faaliyet gösteren, müşterilerine kaliteli ürün ve mühendislik desteği sunan bir Türk şirketidir.</p>

<h3>Misyonumuz</h3>
<p>Endüstriyel sektörde faaliyet gösteren işletmelere yüksek kaliteli makina, otomasyon ekipmanları ve teknik çözümler sunarak üretim verimliliğini artırmak, maliyetleri düşürmek ve rekabet güçlerini geliştirmek.</p>

<h3>Vizyonumuz</h3>
<p>Türkiye'nin endüstriyel otomasyon sektöründe öncü ve güvenilir çözüm ortağı olmak; uluslararası standartlarda ürün ve hizmet kalitesiyle global pazarda söz sahibi bir marka haline gelmek.</p>

<h3>Değerlerimiz</h3>
<ul>
  <li><strong>Kalite:</strong> Her ürün ve hizmette en yüksek standartları benimsiyoruz</li>
  <li><strong>Güvenilirlik:</strong> Müşterilerimize verdiğimiz sözleri tutuyoruz</li>
  <li><strong>Yenilikçilik:</strong> Teknolojiyi yakından takip ederek en güncel çözümleri sunuyoruz</li>
  <li><strong>Müşteri Odaklılık:</strong> Müşteri memnuniyeti her kararımızın merkezindedir</li>
</ul>

<h3>Neden SivTech Makina?</h3>
<ul>
  <li>Geniş ürün yelpazesi ve stok kapasitesi</li>
  <li>Uzman mühendislik ve teknik destek ekibi</li>
  <li>Hızlı teslimat ve lojistik altyapısı</li>
  <li>Rekabetçi fiyat politikası</li>
  <li>Satış sonrası destek ve garanti hizmetleri</li>
</ul>

<h3>İletişim</h3>
<p>Adres: Gültepe Mahallesi 11. Sanayi Sok. 36/H Merkez/SİVAS<br>
E-posta: sivtechmakina@gmail.com<br>
Vergi No: 7721512290 | Vergi Dairesi: SİTE</p>`,
  },
];

async function main() {
  console.log("Seeding static pages...");

  for (const page of pages) {
    const existing = await prisma.staticPage.findUnique({ where: { slug: page.slug } });
    if (existing) {
      console.log(`  ⏭  Already exists: ${page.title}`);
      continue;
    }
    await prisma.staticPage.create({ data: page });
    console.log(`  ✓  Created: ${page.title}`);
  }

  console.log("\nDone.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
