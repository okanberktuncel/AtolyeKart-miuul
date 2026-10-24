# AtölyeKart

El yapımı ürünler satan bir atölyenin e-ticaret / tanıtım web sitesi.

Seri üretim değil, atölyede küçük partiler halinde üretilen, birbirinin aynısı olmayan ürünler vurgusu ön planda. Marka dili: sıcak, samimi, zanaatkâr emeğini öne çıkaran.

## Sektör

Ev dekorasyonu ve kişisel aksesuar odaklı **el yapımı (handmade) ürünler**.

## Hedef Kitle

- **Birincil:** 25-45 yaş arası, şehirli, ev dekorasyonuna ve sürdürülebilir/butik tüketime önem veren kadın ağırlıklı kitle.
- **İkincil:** Özel gün hediyesi arayanlar (doğum günü, yıl dönümü, ev hediyesi, kurumsal hediyelik).
- **Üçüncül:** Kendi atölyesini büyütmek isteyen, iş birliği/toptan sipariş arayan küçük butik ve kafe işletmeleri.

## Ürün Kategorileri

1. **Seramik** — el yapımı kupa, tabak, vazo, dekoratif obje, seramik saksı.
2. **Mum** — soya mumu, kokulu mumlar, dekoratif şekilli mumlar, hediyelik mum setleri.
3. **Takı** — el yapımı küpe, kolye, bileklik; doğal taş ve reçine ağırlıklı tasarımlar.

## Teknoloji

- `index.html`: build adımı olmayan tek dosyalık React uygulaması (React 18 UMD + Babel Standalone, CDN üzerinden).
- `src/data/products.json`: ürün verisinin tek kaynağı (web, mobil, API ve n8n aynı dosyayı kullanır; `inStock` alanı stok durumunu belirler).
- `api/`: Vercel serverless function'ları. `POST /api/order` ve `POST /api/stock-notify` formları sunucuda doğrular, rate limit uygular ve secret header ile n8n'e iletir.
- `mobile/`: Expo (React Native) uygulaması — aynı ürünler ve aynı API (bkz. `mobile/README.md`).
- `n8n/`: local n8n ortamı (docker compose) ve tüm workflow'lar — sipariş/stok akışları, AI mail, günlük özet, RAG chatbot, MCP (bkz. `n8n/README.md`).

Detaylı geliştirme kuralları ve webhook veri sözleşmesi için `.claude/skills/atolyekart-conventions/SKILL.md` dosyasına bakın. Deploy öncesi güvenlik kontrolü: `docs/security-checklist.md`.

## Çalıştırma

```bash
cp .env.example .env.local   # n8n webhook adresleri + WEBHOOK_SECRET (boş bırakılırsa payload sadece loglanır)
npm run dev                  # http://localhost:3000 — statik site + /api route'ları
npm test                     # API doğrulama, rate limit ve webhook iletimi testleri
```

`index.html` ürün verisini `fetch` ile yüklediği için dosyayı doğrudan (`file://`) açmak çalışmaz; `npm run dev` kullanın.

**Deploy:** `npx vercel` (ilk seferde proje bağlanır), ardından Vercel → Settings → Environment Variables'a `.env.example` içindeki değişkenleri girin ve `npx vercel --prod`.

**Mobil:** `cd mobile && cp .env.example .env.local && npm install && npm start`, ardından Expo Go ile QR kodu tarayın.

**n8n:** `n8n/README.md` dosyasındaki kurulum adımları.
