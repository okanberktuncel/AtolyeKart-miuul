import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text } from 'react-native';

import { ConsentRow, Field, SubmitButton, SuccessView, styles, useFormSubmit } from '@/components/form';
import { PRODUCTS } from '@/data/products';

export default function StokBildirimi() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const product = PRODUCTS.find((p) => p.id === productId);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const { submitted, isSubmitting, error, submit } = useFormSubmit('/api/stock-notify');

  if (!product) return <Text style={styles.desc}>Ürün bulunamadı.</Text>;

  if (submitted) {
    return (
      <SuccessView
        title="Talebiniz alındı"
        message={`${product.title} yeniden stoğa girdiğinde size e-posta göndereceğiz.`}
      />
    );
  }

  const canSubmit = name.trim() !== '' && email.trim() !== '' && consent && !isSubmitting;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.desc}>Bu ürün şu an tükendi. Yeniden üretildiğinde size haber verelim.</Text>
      <Field label="Ad Soyad" value={name} onChangeText={setName} autoCapitalize="words" maxLength={80} />
      <Field label="E-posta" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <ConsentRow value={consent} onChange={setConsent} />
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      <SubmitButton
        label="Bildirim İste"
        disabled={!canSubmit}
        loading={isSubmitting}
        onPress={() => submit({ name, email, productId: product.id, consent })}
      />
    </ScrollView>
  );
}
