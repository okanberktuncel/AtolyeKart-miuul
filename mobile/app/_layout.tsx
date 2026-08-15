import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { CartProvider } from '@/context/CartContext';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.bg },
          headerTintColor: Colors.text,
          contentStyle: { backgroundColor: Colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="gizlilik" options={{ title: 'Gizlilik Politikası' }} />
        <Stack.Screen name="randevu" options={{ presentation: 'modal', title: 'Randevu Talep Et' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </CartProvider>
  );
}
