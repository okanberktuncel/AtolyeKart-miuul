# AtölyeKart Mobile

Expo (React Native) uygulaması. `../index.html` web sitesiyle aynı ürün verisi ve marka diline sahip, ayrı bir platform.

## Çalıştırma

```
npm install
npm start
```

Expo Go uygulamasıyla QR kodu tarayarak açabilirsiniz. Native derleme veya EAS gerekmez.

## Ekranlar

- **Anasayfa / Ürünler / Sepet / Profil** — alt sekmeler.
- **Gizlilik Politikası** — profilden erişilen, `index.html` ile aynı KVKK metni.
- **Randevu Talep Et** — modal form, anasayfadan açılır; `lib/webhook.ts` üzerinden aynı `appointment.request` webhook sözleşmesini kullanır (`WEBHOOK_URL` henüz boş — n8n adresi geldiğinde doldurulacak).

## Kapsam dışı (v1)

- QR panel (web'de bir tarayıcının uygulamaya geçişi için var; uygulama içinden anlamsız).
- Ürün detay ekranı, favoriler, `cart.save` webhook çağrısı — web'de de henüz yok, burada da eklenmedi.

## Veri

`data/products.ts`, `index.html`'deki `PRODUCTS`/`CATEGORIES` dizilerinin birebir kopyasıdır. İki proje ayrı platformlar olduğu için ortak bir paket/monorepo kurulmadı; ürün eklerken her iki dosyayı da güncelleyin.
