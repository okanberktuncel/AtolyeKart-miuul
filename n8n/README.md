# AtölyeKart · n8n (Hafta 3–6)

Local (self-hosted) n8n ortamı ve AtölyeKart'ın tüm workflow'ları. Her şey tek bir `docker compose` ile ayağa kalkar: n8n, Redis, Qdrant, Ollama ve isteğe bağlı olarak ngrok.

## Mimari

```
Web sitesi / Expo Go ──► Vercel API (/api/order, /api/stock-notify)
                              │  validasyon + rate limit + X-Atolyekart-Secret
                              ▼
                         ngrok sabit domain ──► n8n (localhost:5678)
                                                  ├─ Google Sheets (siparişler, özetler, hatalar)
                                                  ├─ Ollama (AI mail, AI Agent, embedding)
                                                  ├─ Qdrant (RAG vector DB)
                                                  └─ Redis (chatbot sohbet geçmişi)
```

Tarayıcı ve telefon n8n'i hiç görmez. Secret yalnızca Vercel env'inde ve `n8n/.env` dosyasında durur.

## Workflow'lar

| Dosya | Hafta | Ne yapar |
|---|---|---|
| `01-siparis-ver.json` | 3, 4 | Webhook → secret kontrolü → ortak doğrulama → `siparisler` → 200 → Ollama ile teşekkür maili + tahmini hazırlanma süresi → `ai_mailler` |
| `02-stok-bildirimi.json` | 3, 4 | Webhook → secret → ortak doğrulama → `stok_talepleri` → 200 → **AI Agent** (tool: `urun_katalogu`) alternatif ürün önerir → `alternatif_oneriler` |
| `10-ortak-dogrulama.json` | 4 | **Sub-workflow**: e-posta formatı, event, ürün ID, adet kontrolü. Geçersizse **Stop and Error** |
| `11-urun-katalogu.json` | 4, 6 | Sub-workflow: sitedeki `products.json`'u okur (AI Agent, chatbot ve MCP aracı) |
| `20-hata-yakalayici.json` | 4 | **Error Trigger** → `hatalar` sekmesi. Diğer akışların Error Workflow'u |
| `30-gunluk-siparis-ozeti.json` | 4 | Her gün 21:00 · **Code** ile ürüne göre gruplama → **Loop** → `gunluk_ozet` |
| `40-chatbot-dokuman-yukle.json` | 5 | PDF → chunk (600/80) → `nomic-embed-text` → Qdrant (`doc`, `category`, `version` metadata) |
| `41-urun-sss-chatbot.json` | 5, 6 | **Chat Trigger** → AI Agent + Qdrant aracı + **Redis Chat Memory** + `urun_katalogu` |
| `50-mcp-sunucusu.json` | 6 | **MCP Server Trigger**, `urun_katalogu` aracını Claude Code'a açar |

Workflow ID'leri sabittir (`atk...`). Bu yüzden alt akış çağrıları ve Error Workflow ayarı import'tan sonra elle seçim gerektirmez.

## Kurulum (yaklaşık 45 dk)

Ön koşul: Docker Desktop. Ollama'yı zaten bilgisayarına kurduysan compose'daki `ollama` servisini silebilirsin. Bu durumda `credentials/credentials.json` içindeki `baseUrl` değerini `http://host.docker.internal:11434` yap.

1. **Ortam değişkenleri**
   ```bash
   cd n8n
   cp .env.example .env     # WEBHOOK_SECRET, ATOLYEKART_SITE_URL, ATOLYEKART_SHEET_ID, NGROK_*
   ```
   `WEBHOOK_SECRET` değeri kök dizindeki `.env.local` ve Vercel env ile aynı olmalı.

2. **Google Sheet:** `atolyekart-sheet-sablonu.xlsx` dosyasını Google Drive'a yükle, "Google E-Tablolar'da aç" de. Sonra *Dosya → Google E-Tablolar olarak kaydet* seçeneğiyle kaydet. Sekme adları ve başlık satırları hazır gelir. URL'deki ID'yi `.env` dosyasındaki `ATOLYEKART_SHEET_ID` değerine yaz.

3. **Ayağa kaldır**
   ```bash
   docker compose up -d
   ```
   http://localhost:5678 adresini açıp owner hesabını oluştur.

4. **Import + yayınla**
   ```bash
   ./scripts/kurulum.sh
   ```
   Bu script şunları yapar: Ollama modellerini indirir, credential iskeletlerini import eder, workflow'ları import edip yayınlar ve n8n'i yeniden başlatır.
   > n8n 2.x'te bir alt akış, ancak kendisi de **yayında (published)** ise çağrılabilir. Script bu yüzden alt akışları da yayınlıyor.

5. **Google Sheets OAuth:** Google Cloud Console'da bir OAuth client oluştur (tip: Web application, redirect URI: n8n'in credential ekranında gösterdiği "OAuth Redirect URL", genelde `http://localhost:5678/rest/oauth2-credential/callback`) ve Google Sheets API'yi etkinleştir. Ardından n8n'de *Credentials → Google Sheets (AtölyeKart)* bölümüne Client ID ve Secret'ı girip **Sign in with Google** de.

6. **Tunnel (Vercel ve telefon için):** ngrok hesabında ücretsiz sabit domain'ini al. `.env` dosyasında `NGROK_AUTHTOKEN`, `NGROK_DOMAIN` ve `N8N_PUBLIC_URL` değerlerini doldur ve şunu çalıştır:
   ```bash
   docker compose --profile tunnel up -d
   ```
   Vercel env değerleri:
   - `N8N_ORDER_WEBHOOK_URL=https://<domain>/webhook/atolyekart/siparis`
   - `N8N_STOCK_WEBHOOK_URL=https://<domain>/webhook/atolyekart/stok-bildirimi`

   Sadece local test yapacaksan tunnel gerekmez. Bu durumda kökteki `.env.local` dosyasına `http://localhost:5678/webhook/...` yaz.

7. **RAG dokümanları:** *40 · Chatbot dokümanlarını yükle* workflow'unu aç ve **Execute workflow** de. Sonucu http://localhost:6333/dashboard → `atolyekart_docs` koleksiyonunda görebilirsin.

## Test komutları

```bash
# Secret'sız → 401
curl -X POST localhost:5678/webhook/atolyekart/siparis -H 'Content-Type: application/json' -d '{}'

# Uçtan uca: kök dizinde `npm run dev` açıkken
curl -X POST localhost:3000/api/order -H 'Content-Type: application/json' \
  -d '{"name":"Ayşe Yılmaz","phone":"0532 123 45 67","email":"ayse@example.com","quantity":2,"productId":"seramik-kupa","consent":true}'

# Error Handler kanıtı: bilinmeyen ürün ID'si → 400 + "hatalar" sekmesine satır
curl -X POST localhost:5678/webhook/atolyekart/siparis -H 'Content-Type: application/json' \
  -H "X-Atolyekart-Secret: $WEBHOOK_SECRET" \
  -d '{"event":"order.create","name":"Test","productId":"yok-boyle-urun","email":"a@b.co","quantity":1}'

# Hafta 6 · n8n API (Settings → n8n API → Create API key)
N8N_API_KEY=... node scripts/haftalik-siparis-sayisi.js

# Hafta 6 · MCP (workflow 50 yayındayken)
claude mcp add --transport http atolyekart http://localhost:5678/mcp/atolyekart
```

**RAG güncelleme senaryosu (Hafta 5.2):** `docs/soya-mumu-kullanim-rehberi-v1.pdf` dosyasını sil, `docs-guncelleme/soya-mumu-kullanim-rehberi-v2.pdf` dosyasını `docs/` klasörüne taşı ve workflow 40'ı tekrar çalıştır. Koleksiyon sıfırlanıp yeniden yüklenir. Chatbot'a "Gece Kokusu mumu kaç saat yanar?" diye sor: v1'de bu bilgi yok, v2'de "35 saat" cevabı gelmeli. Qdrant'ta `metadata.version = 2` görünür.

**Chatbot hafıza testi (Hafta 6.1):** Chat Trigger node'undaki URL'yi aç. Önce "Benim adım Okan, seramik kupa aldım" yaz, sonra "Kupamı bulaşık makinesinde yıkayabilir miyim?" diye sor, en son da "Adım neydi?" diye sor. Aynı oturumda adını hatırlamalı. Redis'te kontrol etmek için: `docker compose exec redis redis-cli KEYS '*'`

## Bilinen sınırlar

- Bilgisayar kapalıyken canlı site sipariş alamaz: Vercel API 502 döner ve kullanıcı "tekrar deneyin" mesajı görür.
- `qwen2.5:7b` modeli yaklaşık 5 GB indirme ve 8 GB RAM ister. Makine zorlanırsa `qwen2.5:3b` kullan (workflow'lardaki *Ollama Chat Model* node'larında).
- Gerçek e-posta gönderilmez. AI mail metinleri `ai_mailler` sekmesine taslak olarak yazılır (Hafta 3 bunu kabul ediyor).
