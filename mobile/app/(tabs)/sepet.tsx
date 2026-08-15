import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { useCart } from '@/context/CartContext';
import { Colors } from '@/constants/theme';
import { PRODUCTS } from '@/data/products';

export default function Sepet() {
  const { cart, updateQty, removeFromCart } = useCart();

  if (cart.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Sepetiniz boş.</Text>
      </View>
    );
  }

  const total = cart.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId)!;
    return sum + product.price * item.qty;
  }, 0);

  return (
    <View style={styles.screen}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const product = PRODUCTS.find((p) => p.id === item.productId)!;
          return (
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{product.title}</Text>
                <Text style={styles.rowPrice}>₺{product.price}</Text>
              </View>
              <View style={styles.qtyControls}>
                <Pressable style={styles.qtyBtn} onPress={() => updateQty(item.productId, -1)}>
                  <Text style={styles.qtyBtnText}>−</Text>
                </Pressable>
                <Text style={styles.qtyValue}>{item.qty}</Text>
                <Pressable style={styles.qtyBtn} onPress={() => updateQty(item.productId, 1)}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </Pressable>
              </View>
              <Pressable onPress={() => removeFromCart(item.productId)}>
                <Text style={styles.removeText}>Kaldır</Text>
              </Pressable>
            </View>
          );
        }}
      />
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Toplam</Text>
        <Text style={styles.summaryValue}>₺{total}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg },
  emptyText: { color: Colors.textMuted, fontSize: 15 },
  list: { padding: 16, gap: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rowTitle: { fontWeight: '600', color: Colors.text },
  rowPrice: { color: Colors.textMuted, marginTop: 2 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  qtyBtnText: { fontSize: 16, color: Colors.text, fontWeight: '700' },
  qtyValue: { minWidth: 18, textAlign: 'center', fontWeight: '600', color: Colors.text },
  removeText: { color: Colors.accentDark, fontSize: 12, fontWeight: '600' },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.cardBg,
  },
  summaryLabel: { fontSize: 15, color: Colors.text },
  summaryValue: { fontSize: 18, fontWeight: '700', color: Colors.text },
});
