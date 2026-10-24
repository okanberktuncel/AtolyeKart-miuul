# AtölyeKart · Deploy öncesi güvenlik checklist'i (Hafta 2.6)

✅ işaretli maddeler kodda yapıldı ve `npm test` ile doğrulandı. ⬜ işaretli olanlar deploy sırasında elle kontrol edilecek.

## Secret yönetimi
- ✅ Webhook adresleri ve `WEBHOOK_SECRET` yalnızca sunucuda duruyor (`api/_lib/formHandler.js`). `index.html` ve `mobile/` içinde webhook URL'si yok.
- ✅ `.env`, `.env.*` ve `n8n/.env` `.gitignore`'da. Repoda sadece `.env.example` dosyaları var.
- ⬜ `git log -p | grep -i secret` ile geçmişte secret commit'lenmediğini kontrol et.
- ⬜ Vercel → Settings → Environment Variables'a `N8N_ORDER_WEBHOOK_URL`, `N8N_STOCK_WEBHOOK_URL`, `WEBHOOK_SECRET` değerlerini gir (Production ve Preview için ayrı değerlerle).
- ✅ n8n webhook'ları `X-Atolyekart-Secret` header'ı olmayan istekleri 401 ile reddediyor.

## Girdi doğrulama
- ✅ Tüm alanlar sunucuda doğrulanıyor (`api/_lib/validation.js`): ad 2-80 karakter, e-posta TLD kontrolü, TR/uluslararası telefon formatı, adet 1-20 tamsayı, `productId` katalogda var mı, stok durumu, KVKK rızası `true` mu.
- ✅ HTML etiketleri temizleniyor. Payload'a sadece sözleşmedeki alanlar giriyor, fazladan gönderilen alanlar atılıyor.
- ✅ İstek gövdesi en fazla 10 KB (yerel sunucu). Vercel'in kendi limiti de 4.5 MB.
- ✅ n8n tarafında ikinci savunma hattı var: ortak doğrulama sub-workflow'u.

## Kötüye kullanım
- ✅ IP başına dakikada 10 istek (`RATE_LIMIT_PER_MINUTE`), aşılınca 429 ve `Retry-After` döner.
- ⬜ Bilinen sınır: sayaç serverless instance başına tutuluyor. Gerçek trafikte Upstash Redis'e taşınmalı.
- ✅ Sadece `POST` kabul ediliyor (diğer metodlar 405).

## KVKK
- ✅ İki formda da zorunlu açık rıza checkbox'ı var ve Gizlilik Politikası'na link veriyor. Rıza sunucuda da kontrol ediliyor.
- ✅ Gizlilik Politikası toplanan verileri (ad, e-posta, telefon, ürün/adet), amacı, saklama süresini ve üçüncü tarafları (Vercel, n8n, Google Sheets) listeliyor.
- ⬜ Politikadaki `[ticari unvan / açık adres / MERSİS]` yer tutucusunu doldur.

## HTTP başlıkları ve barındırma
- ✅ `vercel.json`: `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY`.
- ✅ `.vercelignore`: `mobile/`, `n8n/`, `docs/`, `tests/` ve `scripts/` canlıya çıkmıyor.
- ✅ CDN script'leri sabit sürümlü ve SRI (`integrity`) hash'li.

## JWT (opsiyonel)
- ⬜ PDF'e göre public forma JWT konmaz. Admin ekranı yapılırsa JWT ile korunacak (kapsam dışı).
