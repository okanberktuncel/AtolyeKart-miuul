import { useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useCart } from '@/context/CartContext';
import { Colors } from '@/constants/theme';
import { CATEGORIES, PRODUCTS, Product } from '@/data/products';

function CategoryTabs({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <View style={styles.tabsRow}>
      {CATEGORIES.map((cat) => (
        <Pressable
          key={cat.id}
          onPress={() => onSelect(cat.id)}
          style={[styles.tab, active === cat.id && styles.tabActive]}
        >
          <Text style={[styles.tabText, active === cat.id && styles.tabTextActive]}>{cat.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (id: string) => void }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{product.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={3}>
          {product.description}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardPrice}>
            ₺{product.price} / {product.unit}
          </Text>
          <Pressable style={styles.addBtn} onPress={() => onAddToCart(product.id)}>
            <Text style={styles.addBtnText}>Sepete Ekle</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function Urunler() {
  const [activeCategory, setActiveCategory] = useState('tumu');
  const { addToCart } = useCart();

  const visible = activeCategory === 'tumu' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <View style={styles.screen}>
      <CategoryTabs active={activeCategory} onSelect={setActiveCategory} />
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <ProductCard product={item} onAddToCart={addToCart} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  tabsRow: { flexDirection: 'row', gap: 8, padding: 16, paddingBottom: 8 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.cardBg, borderWidth: 1, borderColor: Colors.border },
  tabActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  tabText: { color: Colors.text, fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: '#fff' },
  list: { padding: 16, paddingTop: 8, gap: 16 },
  card: { backgroundColor: Colors.cardBg, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  cardImage: { width: '100%', height: 160 },
  cardBody: { padding: 14, gap: 6 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  cardDesc: { fontSize: 13, color: Colors.textMuted, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  cardPrice: { fontWeight: '700', color: Colors.text },
  addBtn: { backgroundColor: Colors.accent, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 12 },
});
