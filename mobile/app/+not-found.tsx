import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Bulunamadı' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Bu sayfa bulunamadı.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Anasayfaya dön</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: Colors.bg },
  title: { fontSize: 18, fontWeight: '600', color: Colors.text },
  link: { marginTop: 15, paddingVertical: 15 },
  linkText: { color: Colors.accent, fontWeight: '600' },
});
