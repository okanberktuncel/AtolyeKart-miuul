// /api/order ve /api/stock-notify için ortak handler:
// method kontrolü → rate limit → doğrulama → secret header ile n8n'e iletme.

const { rateLimit } = require('./rateLimit');

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) return forwarded.split(',')[0].trim();
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

// Vercel req.body'yi JSON olarak hazır verir; yerel dev sunucusunda ise gövdeyi kendimiz okuruz.
async function readBody(req) {
  if (req.body !== undefined) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 10 * 1024) throw new Error('Body too large');
  }
  return raw ? JSON.parse(raw) : {};
}

function createFormHandler({ name, validate, webhookEnv }) {
  return async function handler(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return sendJson(res, 405, { error: 'Yalnızca POST desteklenir.' });
    }

    const limit = Number(process.env.RATE_LIMIT_PER_MINUTE) || 10;
    const { allowed, retryAfter } = rateLimit(`${name}:${clientIp(req)}`, limit);
    if (!allowed) {
      res.setHeader('Retry-After', String(retryAfter));
      return sendJson(res, 429, { error: 'Çok fazla istek gönderdiniz. Lütfen bir dakika sonra tekrar deneyin.' });
    }

    let body;
    try {
      body = await readBody(req);
    } catch (err) {
      return sendJson(res, 400, { error: 'Geçersiz istek gövdesi.' });
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return sendJson(res, 400, { error: 'Geçersiz istek gövdesi.' });
    }

    const { errors, payload } = validate(body);
    if (errors) return sendJson(res, 400, { error: 'Form bilgilerini kontrol edin.', errors });

    const webhookUrl = process.env[webhookEnv];
    if (!webhookUrl) {
      if (process.env.VERCEL_ENV === 'production') {
        console.error(`[${name}] ${webhookEnv} tanımlı değil`);
        return sendJson(res, 500, { error: 'Sunucu yapılandırması eksik.' });
      }
      // Geliştirme ortamında n8n henüz kurulmamış olabilir: payload'ı loglayıp başarılı dönüyoruz.
      console.info(`[${name}] ${webhookEnv} tanımlı değil, webhook gönderilmedi:`, payload);
      return sendJson(res, 200, { ok: true, forwarded: false });
    }

    const headers = { 'Content-Type': 'application/json' };
    if (process.env.WEBHOOK_SECRET) headers['X-Atolyekart-Secret'] = process.env.WEBHOOK_SECRET;

    try {
      const upstream = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...payload, timestamp: new Date().toISOString() }),
        signal: AbortSignal.timeout(10000),
      });
      if (!upstream.ok) {
        console.error(`[${name}] webhook ${upstream.status} döndü`);
        return sendJson(res, 502, { error: 'Talebiniz şu an iletilemedi, lütfen biraz sonra tekrar deneyin.' });
      }
    } catch (err) {
      console.error(`[${name}] webhook isteği başarısız:`, err.message);
      return sendJson(res, 502, { error: 'Talebiniz şu an iletilemedi, lütfen biraz sonra tekrar deneyin.' });
    }

    return sendJson(res, 200, { ok: true, forwarded: true });
  };
}

module.exports = { createFormHandler };
