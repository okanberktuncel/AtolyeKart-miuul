# AtölyeKart Mobile

Expo (React Native) uygulaması. `../index.html` web sitesiyle aynı ürün verisini, aynı API route'larını ve aynı marka dilini kullanan ayrı bir platform.

## Çalıştırma

```
cp .env.example .env.local   # EXPO_PUBLIC_API_BASE_URL'i doldurun
npm install
npm start
```

Expo Go uygulamasıyla QR kodu tarayarak açabilirsiniz. Native derleme veya EAS gerekmez.

`EXPO_PUBLIC_API_BASE_URL`: Telefon bilgisayarınızın `localhost`'unu göremez. Deploy edilmiş Vercel adresini (`https://...vercel.app`) ya da aynı Wi-Fi'daki bilgisayarınızın IP'sini (`http://192.168.x.x:3000`, kökte `npm run dev` açıkken) yazın.

## Ekranlar

- **Anasayfa / Ürünler / Sepet / Profil** — alt sekmeler.
- **Sipariş Ver** — stoktaki ürün kartından açılan modal form (ad, telefon, e-posta, adet, açık rıza) → `POST /api/order`.
- **Stok Bildirimi İste** — tükenen ürün kartından açılan modal form (ad, e-posta, açık rıza) → `POST /api/stock-notify`.
- **Gizlilik Politikası** — profilden ve formlardaki rıza metninden erişilir, `index.html` ile aynı KVKK metni.

Formlar n8n'e doğrudan istek atmaz; doğrulama, rate limit ve webhook secret'ı web sitesiyle ortak Vercel API'de kalır (`../api/`).

## Kapsam dışı (v1)

- QR panel (web'de bir tarayıcının uygulamaya geçişi için var; uygulama içinden anlamsız).
- Ürün detay ekranı, favoriler, sepetten toplu sipariş.

## Veri

Ürünler `../src/data/products.json` dosyasından gelir (web, mobil ve n8n için tek kaynak). `metro.config.js` repo kökünü `watchFolders`'a ekler; ürün eklerken sadece JSON dosyasını güncelleyin.
