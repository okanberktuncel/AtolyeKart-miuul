// Ürün verisi web ile ortak tek kaynaktan gelir: ../../src/data/products.json
// (metro.config.js bu klasörü watchFolders'a ekler).
import data from '../../src/data/products.json';

export type Product = {
  id: string;
  category: string;
  title: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  inStock: boolean;
};

export type Category = { id: string; label: string };

export const PRODUCTS: Product[] = data.products;
export const CATEGORIES: Category[] = data.categories;
