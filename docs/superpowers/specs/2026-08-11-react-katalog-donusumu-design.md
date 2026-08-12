# AtölyeKart Katalog Sayfasının React'e Dönüştürülmesi

**Tarih:** 2026-08-11
**Durum:** Onaylandı

## Amaç

Mevcut statik `katalog.html` sayfasını, npm/build kurulumu gerektirmeyen, CDN üzerinden yüklenen tek dosyalık bir React uygulamasına dönüştürmek. Uygulama üç ana bölüme ayrılacak: **Anasayfa**, **Ürünler** (kategori alt sekmeleriyle) ve **Sepet**, ayrıca bir **Profil** sayfası eklenecek.

## Kapsam Dışı

- Gerçek kimlik doğrulama / backend / veritabanı
- npm, build adımı, paket yöneticisi
- URL tabanlı routing (react-router)
- Ödeme entegrasyonu

## Mimari

Tek HTML dosyası (`index.html`), aşağıdaki CDN script'leri ile:
- React 18 (UMD, production build)
- ReactDOM 18 (UMD, production build)
- Babel Standalone (tarayıcıda JSX derlemesi için)

Tüm bileşen kodu `<script type="text/babel">` bloğu içinde JSX ile yazılır. Sayfa geçişleri client-side state ile yönetilir (URL routing yok).

## Bileşen Ağacı

```
App
├─ NavBar         (Anasayfa / Ürünler / Profil / Sepet linkleri + sepet adet rozeti)
├─ Anasayfa       (marka/tagline + "Ürünleri Keşfet" CTA butonu → page='urunler')
├─ Urunler
│   ├─ CategoryTabs   (Tümü / Seramik / Mum / Takı alt sekmeleri)
│   └─ ProductGrid → ProductCard[]   ("Sepete Ekle" → addToCart)
├─ Profil         (sahte/mock kullanıcı bilgisi: ad, e-posta, adres, sipariş geçmişi placeholder)
├─ Sepet
│   ├─ CartItem[]     (adet artır/azalt, kaldır)
│   └─ CartSummary    (toplam fiyat)
└─ Footer         (mevcut Instagram linki korunur)
```

## State & Veri Akışı

State tek kaynaktan (`App`) yönetilir, alt bileşenlere prop olarak geçirilir. Yerel component state kullanılmaz.

- `page: 'anasayfa' | 'urunler' | 'profil' | 'sepet'` — aktif sayfa
- `activeCategory: 'tumu' | 'seramik' | 'mum' | 'taki'` — Ürünler sekmesinde seçili alt sekme
- `cart: { productId, qty }[]` — sepet içeriği

**Prop akışı:** `products`, `cart`, `onAddToCart`, `onUpdateQty`, `onRemoveFromCart`, `onNavigate` gibi propler App'ten aşağı akar.

**Sepet mantığı:**
- `addToCart(id)` → üründe varsa `qty + 1`, yoksa yeni `{productId, qty: 1}` satırı
- `updateQty(id, delta)` → adet günceller, 0'a inerse satırı kaldırır
- `removeFromCart(id)` → satırı siler
- `CartSummary` toplamı `cart` ve `PRODUCTS`'tan `reduce` ile hesaplar
- Sepet boşsa "Sepetiniz boş" mesajı gösterilir

## Ürün Verisi

`App` içinde sabit `PRODUCTS` dizisi: `{ id, category, title, description, price, unit, image }`. Mevcut 3 üründen (seramik/mum/takı) her kategoriye 2-3 ürün daha eklenerek toplam ~9-10 ürünlük bir katalog oluşturulacak. Görseller, ücretsiz kullanım lisanslı (Unsplash) ve kategoriyle uyumlu, çalıştığı doğrulanmış gerçek fotoğraf URL'leridir.

## Profil Verisi

Sabit mock obje: `{ name, email, address, orders: [] }`. Gerçek auth/backend yok, sadece arayüz amaçlı statik veri.

## Stil

Mevcut `katalog.html`'deki CSS custom property'leri (`--bg`, `--accent`, `--accent-dark`, `--border`, vb.) ve kart/buton stilleri korunur. NavBar, CategoryTabs ve sepet satırları için aynı paleti kullanan yeni stiller eklenir.

## Test / Doğrulama

npm/test altyapısı yok. Dosya tarayıcıda açılarak şu akış manuel doğrulanır:
1. Anasayfa → "Ürünleri Keşfet" butonu → Ürünler sayfası
2. Kategori sekmeleri arası geçiş (Tümü/Seramik/Mum/Takı)
3. "Sepete Ekle" → Sepet sekmesinde ürünün görünmesi
4. Sepette adet artırma/azaltma ve ürün kaldırma
5. Profil sayfasının görüntülenmesi
6. Toplam fiyat hesabının doğruluğu

## Notlar

- Proje bir git deposu değil; bu doküman dosya sistemine kaydedildi ancak commit edilmedi.
