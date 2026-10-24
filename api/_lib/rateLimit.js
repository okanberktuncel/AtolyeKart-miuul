// Basit sabit pencereli rate limit: IP başına dakikada N istek.
// Not: Vercel'de her serverless instance kendi sayacını tutar. Ödev kapsamı için yeterli;
// kalıcı ve paylaşımlı sayaç gerekirse Upstash Redis'e taşınabilir.

const WINDOW_MS = 60 * 1000;
const hits = new Map();

function rateLimit(key, limit) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now - entry.start >= WINDOW_MS) {
    hits.set(key, { start: now, count: 1 });
    return { allowed: true, retryAfter: 0 };
  }
  entry.count += 1;
  if (entry.count > limit) {
    return { allowed: false, retryAfter: Math.ceil((entry.start + WINDOW_MS - now) / 1000) };
  }
  return { allowed: true, retryAfter: 0 };
}

function resetRateLimit() {
  hits.clear();
}

module.exports = { rateLimit, resetRateLimit };
