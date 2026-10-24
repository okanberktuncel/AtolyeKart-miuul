#!/usr/bin/env node
// Hafta 6 · n8n API: "Bu hafta kaç sipariş geldi?"
// "01 · Sipariş Ver" workflow'unun execution'larını n8n public API'den çeker ve
// siparişin Sheet'e yazıldığı (yani doğrulamadan geçtiği) çalışmaları sayar.
//
// Kullanım:
//   N8N_API_KEY=... node n8n/scripts/haftalik-siparis-sayisi.js
//   N8N_URL varsayılanı http://localhost:5678. API key: n8n > Settings > n8n API > Create API key

const N8N_URL = (process.env.N8N_URL || 'http://localhost:5678').replace(/\/$/, '');
const API_KEY = process.env.N8N_API_KEY;
const WORKFLOW_ID = process.env.ORDER_WORKFLOW_ID || 'atkSiparisVer001';
const ORDER_SAVED_NODE = 'Siparişler sekmesine yaz';
const TZ = 'Europe/Istanbul';

if (!API_KEY) {
  console.error('N8N_API_KEY ortam değişkeni gerekli (n8n > Settings > n8n API).');
  process.exit(1);
}

const dayOf = (date) => new Date(date).toLocaleDateString('sv-SE', { timeZone: TZ }); // YYYY-MM-DD

// Bu haftanın pazartesisi (İstanbul saatiyle), YYYY-MM-DD
function startOfWeek() {
  const today = new Date(`${dayOf(new Date())}T00:00:00Z`);
  const weekday = (today.getUTCDay() + 6) % 7; // pazartesi = 0
  today.setUTCDate(today.getUTCDate() - weekday);
  return today.toISOString().slice(0, 10);
}

async function fetchExecutions() {
  const executions = [];
  let cursor;
  do {
    const url = new URL(`${N8N_URL}/api/v1/executions`);
    url.searchParams.set('workflowId', WORKFLOW_ID);
    url.searchParams.set('includeData', 'true');
    url.searchParams.set('limit', '100');
    if (cursor) url.searchParams.set('cursor', cursor);

    const res = await fetch(url, { headers: { 'X-N8N-API-KEY': API_KEY, accept: 'application/json' } });
    if (!res.ok) throw new Error(`n8n API ${res.status}: ${await res.text()}`);
    const body = await res.json();
    executions.push(...body.data);
    cursor = body.nextCursor;
    // Liste en yeniden eskiye gelir; haftanın başından eskiye indiysek durabiliriz.
    const oldest = body.data.at(-1);
    if (oldest && dayOf(oldest.startedAt) < startOfWeek()) break;
  } while (cursor);
  return executions;
}

(async () => {
  const weekStart = startOfWeek();
  const executions = await fetchExecutions();

  const perDay = {};
  for (const ex of executions) {
    const day = dayOf(ex.startedAt);
    if (day < weekStart) continue;
    const runData = ex.data?.resultData?.runData ?? {};
    if (!runData[ORDER_SAVED_NODE]) continue; // 401/400 ile reddedilen istekleri sayma
    perDay[day] = (perDay[day] ?? 0) + 1;
  }

  const total = Object.values(perDay).reduce((a, b) => a + b, 0);
  console.log(`Bu hafta (${weekStart} → bugün) gelen sipariş: ${total}`);
  for (const [day, count] of Object.entries(perDay).sort()) console.log(`  ${day}: ${count}`);
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
