import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Switch, Text, TextInput, TextInputProps, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { postForm } from '@/lib/formApi';

// Sipariş ve stok bildirimi ekranlarının ortak gönderim mantığı: yükleniyor durumu, sunucu hatası, başarı.
export function useFormSubmit(path: '/api/order' | '/api/stock-notify') {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function submit(payload: Record<string, unknown>) {
    setIsSubmitting(true);
    setError('');
    try {
      await postForm(path, payload);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submitted, isSubmitting, error, submit };
}

export function Field({ label, ...inputProps }: { label: string } & TextInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor={Colors.textMuted} {...inputProps} />
    </View>
  );
}

export function ConsentRow({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.consentRow}>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: Colors.accent }} />
      <Text style={styles.consentText}>
        Kişisel verilerimin{' '}
        <Text style={styles.link} onPress={() => router.push('/gizlilik')}>
          Gizlilik Politikası
        </Text>{' '}
        kapsamında işlenmesine açık rıza veriyorum.
      </Text>
    </View>
  );
}

export function SubmitButton({ label, disabled, loading, onPress }: { label: string; disabled: boolean; loading: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.primaryBtn, disabled && styles.primaryBtnDisabled]} onPress={onPress} disabled={disabled}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>{label}</Text>}
    </Pressable>
  );
}

export function SuccessView({ title, message }: { title: string; message: string }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{message}</Text>
      <SubmitButton label="Kapat" disabled={false} loading={false} onPress={() => router.back()} />
    </View>
  );
}

export const styles = StyleSheet.create({
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
  consentRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  consentText: { flex: 1, fontSize: 12, color: Colors.textMuted, lineHeight: 17 },
  link: { color: Colors.accent, textDecorationLine: 'underline' },
  error: { color: '#a23b2a', fontSize: 13 },
  primaryBtn: { backgroundColor: Colors.accent, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
