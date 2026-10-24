import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text } from 'react-native';

import { ConsentRow, Field, SubmitButton, SuccessView, styles, useFormSubmit } from '@/components/form';
import { PRODUCTS } from '@/data/products';

export default function Siparis() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const product = PRODUCTS.find((p) => p.id === productId);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [consent, setConsent] = useState(false);
  const { submitted, isSubmitting, error, submit } = useFormSubmit('/api/order');

  if (!product) return <Text style={styles.desc}>Ürün bulunamadı.</Text>;

  if (submitted) {
    return (
      <SuccessView
        title="Siparişiniz alındı"
        message={`${product.title} için siparişiniz bize ulaştı. Hazırlık süresini e-posta ile bildireceğiz.`}
      />
    );
  }

  const canSubmit = name.trim() !== '' && phone.trim() !== '' && email.trim() !== '' && consent && !isSubmitting;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.desc}>
        ₺{product.price} / {product.unit}
      </Text>
      <Field label="Ad Soyad" value={name} onChangeText={setName} autoCapitalize="words" maxLength={80} />
      <Field label="Telefon" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="05xx xxx xx xx" />
      <Field label="E-posta" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <Field label="Adet" value={quantity} onChangeText={setQuantity} keyboardType="number-pad" maxLength={2} />
      <ConsentRow value={consent} onChange={setConsent} />
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      <SubmitButton
        label="Siparişi Gönder"
        disabled={!canSubmit}
        loading={isSubmitting}
        onPress={() => submit({ name, phone, email, quantity: Number(quantity), productId: product.id, consent })}
      />
    </ScrollView>
  );
}
