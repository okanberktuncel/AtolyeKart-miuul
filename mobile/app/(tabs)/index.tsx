import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

export default function Anasayfa() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>AtölyeKart</Text>
      <Text style={styles.title}>Elde şekillenen, atölyede doğan ürünler</Text>
      <Text style={styles.desc}>
        Seri üretim değil — her parça atölyede küçük partiler halinde, elle üretiliyor. Seramik, mum ve takı
        koleksiyonlarımızı keşfedin.
      </Text>

      <Pressable style={styles.primaryBtn} onPress={() => router.push('/urunler')}>
        <Text style={styles.primaryBtnText}>Ürünleri Keşfet</Text>
      </Pressable>

      <Pressable style={styles.secondaryBtn} onPress={() => router.push('/randevu')}>
        <Text style={styles.secondaryBtnText}>Müşteri Temsilcisi ile Randevu Talep Et</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, paddingTop: 32, gap: 12 },
  eyebrow: { color: Colors.accent, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', fontSize: 12 },
  title: { fontSize: 26, fontWeight: '700', color: Colors.text, lineHeight: 32 },
  desc: { fontSize: 15, color: Colors.textMuted, lineHeight: 22, marginBottom: 12 },
  primaryBtn: { backgroundColor: Colors.accent, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
  },
  secondaryBtnText: { color: Colors.text, fontWeight: '600', fontSize: 14 },
});
