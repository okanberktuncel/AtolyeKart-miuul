import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

const SECTIONS: { title: string; body: string }[] = [
  {
    title: '1. Veri Sorumlusu',
    body: 'Bu web sitesi üzerinden paylaştığınız kişisel veriler, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca veri sorumlusu sıfatıyla AtölyeKart [ticari unvan / açık adres / MERSİS numarası eklenecek] tarafından işlenir.',
  },
  {
    title: '2. Toplanan Kişisel Veriler',
    body: '"Müşteri Temsilcisi ile Randevu Talep Et" formunu doldurduğunuzda yalnızca Ad Soyad ve E-posta adresi toplanır. Sepete veya favorilere ürün eklemeniz ayrıca sistemsel olarak kaydedilir; bu kayıtlar kimliğinizi içermez.',
  },
  {
    title: '3. İşlenme Amacı',
    body: 'Paylaştığınız veriler yalnızca randevu talebinizi değerlendirmek ve sizinle iletişime geçmek amacıyla işlenir; pazarlama veya üçüncü taraflara satış amacıyla kullanılmaz.',
  },
  {
    title: '4. Hukuki Sebep',
    body: 'Verileriniz, KVKK m.5/2 kapsamında sözleşme öncesi görüşme sürecinin yürütülmesi ve tarafımızın meşru menfaati doğrultusunda, formu göndererek verdiğiniz açık rızaya dayanılarak işlenir.',
  },
  {
    title: '5. Saklama Süresi',
    body: 'Randevu talebinize ilişkin veriler, talebin sonuçlandırılmasından itibaren en fazla 2 yıl içinde silinir, yok edilir veya anonim hale getirilir. Mevzuattan doğan zorunlu saklama süreleri bu kuralın istisnasıdır.',
  },
  {
    title: '6. Üçüncü Taraflar ve Veri Aktarımı',
    body: 'Hizmetin sunulabilmesi için verileriniz sınırlı ölçüde şu sağlayıcılarla paylaşılır: Vercel Inc. (hosting altyapısı; sunucular yurt dışında olabileceğinden veriler KVKK m.9 uyarınca yurt dışına aktarılabilir) ve n8n (randevu talebinizin ilgili ekibe iletilmesini sağlayan otomasyon/webhook aracı). Verileriniz bu sağlayıcılar dışında üçüncü taraflarla paylaşılmaz veya satılmaz.',
  },
  {
    title: '7. Haklarınız (KVKK m.11)',
    body: 'Bize başvurarak; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacına uygun kullanılıp kullanılmadığını öğrenme, aktarıldığı üçüncü kişileri bilme, eksik/yanlış işlenmişse düzeltilmesini isteme, silinmesini/yok edilmesini isteme, otomatik analiz sonucuna itiraz etme ve uğradığınız zararın giderilmesini talep etme haklarına sahipsiniz.',
  },
  {
    title: '8. Silme Talebi ve Başvuru Yöntemi',
    body: 'Verilerinizin silinmesi dahil yukarıdaki haklarınızı kullanmak için gizlilik@atolyekart.com adresine talebinizi iletebilirsiniz. Başvurunuz KVKK m.13 uyarınca en geç 30 gün içinde yanıtlanır.',
  },
  {
    title: '9. Değişiklikler',
    body: 'Bu politika, yasal düzenlemeler veya veri işleme süreçlerimizdeki değişikliklere göre güncellenebilir. Güncel sürüm her zaman bu sayfada yayınlanır.',
  },
];

export default function Gizlilik() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.updated}>Son güncelleme: 14 Ağustos 2026</Text>
      {SECTIONS.map((s) => (
        <View key={s.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{s.title}</Text>
          <Text style={styles.sectionBody}>{s.body}</Text>
        </View>
      ))}
      <Text style={styles.disclaimer}>
        Not: Bu metin genel bir çerçeve sunar; işletmenizin gerçek veri işleme süreçlerine uyarlanması ve bir hukuk
        danışmanına onaylatılması önerilir.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, gap: 16 },
  updated: { fontSize: 12, color: Colors.textMuted },
  section: { gap: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  sectionBody: { fontSize: 13, color: Colors.textMuted, lineHeight: 19 },
  disclaimer: { fontSize: 11, color: Colors.textMuted, fontStyle: 'italic', marginTop: 8 },
});
