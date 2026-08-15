import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

const MOCK_USER = {
  name: 'Ayşe Yılmaz',
  email: 'ayse.yilmaz@example.com',
  address: 'Caferağa Mah. Moda Cad. No:14, Kadıköy / İstanbul',
};

export default function Profil() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Profil</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Ad Soyad</Text>
        <Text style={styles.value}>{MOCK_USER.name}</Text>
        <Text style={styles.label}>E-posta</Text>
        <Text style={styles.value}>{MOCK_USER.email}</Text>
        <Text style={styles.label}>Adres</Text>
        <Text style={styles.value}>{MOCK_USER.address}</Text>
      </View>
      <Pressable onPress={() => router.push('/gizlilik')}>
        <Text style={styles.link}>Gizlilik Politikası</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg, padding: 20, gap: 16 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.text },
  card: { backgroundColor: Colors.cardBg, borderRadius: 12, padding: 16, gap: 4, borderWidth: 1, borderColor: Colors.border },
  label: { fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', marginTop: 10 },
  value: { fontSize: 15, color: Colors.text },
  link: { color: Colors.accent, fontWeight: '600' },
});
