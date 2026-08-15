import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { sendWebhook } from '@/lib/webhook';

export default function Randevu() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      await sendWebhook('appointment.request', { name: name.trim(), email: email.trim() });
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Talebiniz alındı</Text>
        <Text style={styles.desc}>En kısa sürede sizinle iletişime geçeceğiz.</Text>
        <Pressable style={styles.primaryBtn} onPress={() => router.back()}>
          <Text style={styles.primaryBtnText}>Kapat</Text>
        </Pressable>
      </View>
    );
  }

  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && !isSubmitting;

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Müşteri Temsilcisi ile Randevu Talep Et</Text>
      <Text style={styles.desc}>
        Size en kısa sürede dönüş yapabilmemiz için ad soyad ve e-posta adresinizi paylaşın.
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>Ad Soyad</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} autoCapitalize="words" />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>E-posta</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <Pressable
        style={[styles.primaryBtn, !canSubmit && styles.primaryBtnDisabled]}
        onPress={handleSubmit}
        disabled={!canSubmit}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryBtnText}>Randevu Talebi Gönder</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg, padding: 20, gap: 14 },
  title: { fontSize: 20, fontWeight: '700', color: Colors.text },
  desc: { fontSize: 14, color: Colors.textMuted, lineHeight: 20 },
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.text },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.cardBg,
    color: Colors.text,
  },
  primaryBtn: { backgroundColor: Colors.accent, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
