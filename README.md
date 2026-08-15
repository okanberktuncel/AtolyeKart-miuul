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
- `src/data/card.js`: ürün/demo verisinin tutulduğu tek kaynak.
- `mobile/`: Expo (React Native) uygulaması — web sitesiyle içerik paraleli, ayrı bir proje (bkz. `mobile/README.md`).

Detaylı geliştirme kuralları için `.claude/skills/atolyekart-conventions/SKILL.md` dosyasına bakın.

## Çalıştırma

Build adımı yoktur; `index.html` dosyasını doğrudan bir tarayıcıda açmak yeterlidir.

Mobil uygulama için `cd mobile && npm start`, ardından Expo Go ile QR kodu tarayın.
