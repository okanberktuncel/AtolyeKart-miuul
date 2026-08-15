import React, { createContext, useContext, useMemo, useState } from 'react';

type CartItem = { productId: string; qty: number };

type CartContextValue = {
  cart: CartItem[];
  cartCount: number;
  addToCart: (productId: string) => void;
  updateQty: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  function addToCart(productId: string) {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) => (item.productId === productId ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { productId, qty: 1 }];
    });
  }

  function updateQty(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((item) => (item.productId === productId ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, updateQty, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
