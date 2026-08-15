const WEBHOOK_URL = ''; // TODO: n8n webhook adresi hazır olduğunda buraya yapıştır

export function sendWebhook(event: string, payload: Record<string, unknown>) {
  if (!WEBHOOK_URL) {
    console.info(`[sendWebhook] WEBHOOK_URL henüz ayarlanmadı, "${event}" gönderilmedi.`, payload);
    return Promise.resolve();
  }
  return fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, timestamp: new Date().toISOString(), ...payload }),
  });
}
