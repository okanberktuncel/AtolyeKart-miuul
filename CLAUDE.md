# AtölyeKart

El yapımı ürünler satan bir atölyenin e-ticaret / tanıtım web sitesi.

## Sektör

Ev dekorasyonu ve kişisel aksesuar odaklı **el yapımı (handmade) ürünler**. Seri üretim değil, atölyede küçük partiler halinde üretilen, birbirinin aynısı olmayan ürünler vurgusu ön planda. Marka dili: sıcak, samimi, zanaatkâr emeğini öne çıkaran, "seri üretim değil" mesajını taşıyan.

## Hedef Kitle

- **Birincil:** 25-45 yaş arası, şehirli, ev dekorasyonuna ve sürdürülebilir/butik tüketime önem veren kadın ağırlıklı kitle.
- **İkincil:** Özel gün hediyesi arayanlar (doğum günü, yıl dönümü, ev hediyesi, kurumsal hediyelik).
- **Üçüncül:** Kendi atölyesini büyütmek isteyen, iş birliği/toptan sipariş arayan küçük butik ve kafe işletmeleri.

Kitle fiyata değil **özgünlüğe ve hikâyeye** duyarlı; ürün açıklamalarında malzeme, yapım süreci ve atölye hikâyesi önemli bir satış unsuru.

## Ürün Kategorileri

1. **Seramik** — el yapımı kupa, tabak, vazo, dekoratif obje, seramik saksı.
2. **Mum** — soya mumu, kokulu mumlar, dekoratif şekilli mumlar, hediyelik mum setleri.
3. **Takı** — el yapımı küpe, kolye, bileklik; doğal taş ve reçine ağırlıklı tasarımlar.

Her kategori kendi alt filtrelerine sahip olabilir (örn. seramikte "kupa / vazo / tabak", takıda "küpe / kolye / bileklik"). Ürünler arası ortak temalar (renk paleti, sezonluk koleksiyon) siteye "koleksiyon" bazlı gezinme imkânı sunabilir.

## Mimari (Ekim 2026)

Bu proje, BizCard kursuna paralel yürütülen 6 haftalık bir ödev serisi (Hafta 1-2 web + mobil, Hafta 3-6 n8n).

```
Web (index.html) ┐
                 ├─► Vercel API (api/order, api/stock-notify) ──► ngrok ──► local n8n
Expo (mobile/)   ┘     validasyon · rate limit · X-Atolyekart-Secret        ├─ Google Sheets
                                                                             ├─ Ollama (LLM + embedding)
                                                                             ├─ Qdrant (RAG)
                                                                             └─ Redis (chat memory)
```

- **Web:** `index.html`, tek dosya, build yok (React 18 UMD + Babel Standalone). Yerelde `npm run dev` (`scripts/dev-server.js`) ile statik dosya + API birlikte çalışır.
- **Veri:** `src/data/products.json` tek kaynaktır. Web `fetch` ile, mobil Metro `watchFolders` ile, API `require` ile, n8n ise HTTP ile okur.
- **Formlar:** "Sipariş Ver" (stoktaki ürün) ve "Stok Bildirimi İste" (`inStock: false`). İkisinde de zorunlu KVKK rızası var. İstemci asla doğrudan webhook çağırmaz.
- **API:** `api/_lib/validation.js` (doğrulama + payload sözleşmesi), `rateLimit.js`, `formHandler.js`. Testler `tests/` altında, `npm test` (node:test, bağımlılık yok).
- **Mobil:** `mobile/` Expo Router. Formlar `app/siparis.tsx` ve `app/stok-bildirimi.tsx`, API adresi `EXPO_PUBLIC_API_BASE_URL`.
- **n8n:** `n8n/docker-compose.yml` ve `n8n/workflows/*.json` (sabit `atk...` ID'leriyle). Ortak doğrulama ve ürün kataloğu sub-workflow'dur, `20 · Hata yakalayıcı` Error Workflow'dur. Kurulum için `n8n/scripts/kurulum.sh`, haftalık sipariş sayısı için `n8n/scripts/haftalik-siparis-sayisi.js` (n8n public API).
- **Secret'lar:** `.env.local` (kök), `n8n/.env` ve Vercel env. Hepsi git-ignore'da.

## Notlar

- Webhook payload sözleşmesi ödev PDF'iyle sabitlendi: sipariş `event, name, productId, productName, phone, email, quantity, source` (+ `timestamp`), stok `event, name, productId, productName, email, source` (+ `timestamp`). Değişiklik yapılırsa skill dosyası, `api/_lib/validation.js` ve testler birlikte güncellenmeli.
- n8n 2.x'te sub-workflow'ların da yayında (published) olması gerekir. Aksi halde "Workflow is not active" hatası alınır.
- Ödeme entegrasyonu ve gerçek e-posta gönderimi kapsam dışı. AI mail metinleri Sheet'e taslak olarak yazılıyor.
