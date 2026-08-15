import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useCart } from '@/context/CartContext';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  const { cartCount } = useCart();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        headerStyle: { backgroundColor: Colors.bg },
        headerTintColor: Colors.text,
        tabBarStyle: { backgroundColor: Colors.cardBg, borderTopColor: Colors.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Anasayfa',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="urunler"
        options={{
          title: 'Ürünler',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sepet"
        options={{
          title: 'Sepet',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
