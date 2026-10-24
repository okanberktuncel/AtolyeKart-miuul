#!/usr/bin/env bash
# Credential'ları ve workflow'ları çalışan n8n container'ına import eder ve yayınlar.
# Önce: docker compose up -d  +  http://localhost:5678'de owner hesabını oluştur.
# Kullanım (n8n/ klasöründe):  ./scripts/kurulum.sh
set -euo pipefail
cd "$(dirname "$0")/.."

WORKFLOW_IDS=(
  atkHataYakala001   # 20 · Hata yakalayıcı
  atkUrunKatalog01   # 11 · Ürün kataloğu (alt akış)
  atkDogrulama0001   # 10 · Ortak doğrulama (alt akış)
  atkSiparisVer001   # 01 · Sipariş Ver
  atkStokBildir001   # 02 · Stok Bildirimi İste
  atkGunlukOzet001   # 30 · Günlük sipariş özeti
  atkChatbot000001   # 41 · Ürün SSS chatbot'u
  atkMcpSunucu0001   # 50 · MCP sunucusu
)

echo "→ Ollama modelleri indiriliyor (ilk seferde birkaç dakika sürer)"
docker compose exec ollama ollama pull qwen2.5:7b
docker compose exec ollama ollama pull nomic-embed-text

echo "→ Credential iskeletleri (Ollama, Qdrant, Redis, Google Sheets) import ediliyor"
docker compose exec n8n n8n import:credentials --input=/import/credentials/credentials.json

echo "→ Workflow'lar import ediliyor"
docker compose exec n8n n8n import:workflow --separate --input=/import/workflows

echo "→ Workflow'lar yayınlanıyor (n8n 2.x'te alt akışların da yayında olması gerekir)"
for id in "${WORKFLOW_IDS[@]}"; do
  docker compose exec n8n n8n publish:workflow --id="$id"
done

echo "→ n8n yeniden başlatılıyor"
docker compose restart n8n

cat <<'MSG'

Bitti. Kalan elle adımlar (n8n/README.md → "Senin yapacakların"):
  1. Credentials → "Google Sheets (AtölyeKart)": Client ID/Secret'ı gir, "Sign in with Google"
  2. 40 · Chatbot dokümanlarını yükle → "Execute workflow" ile PDF'leri Qdrant'a yükle
MSG
