const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

const { server } = require('../scripts/dev-server');
const { resetRateLimit } = require('../api/_lib/rateLimit');

const order = {
  name: 'Ayşe Yılmaz',
  phone: '0532 123 45 67',
  email: 'ayse@example.com',
  quantity: 1,
  productId: 'seramik-kupa',
  consent: true,
};

let baseUrl;
let webhook;
let received;

test.before(async () => {
  // Sahte n8n webhook'u: gelen istekleri kaydeder.
  received = [];
  webhook = http.createServer((req, res) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      received.push({ headers: req.headers, body: JSON.parse(raw) });
      res.end('{}');
    });
  });
  await new Promise((r) => webhook.listen(0, r));
  process.env.N8N_ORDER_WEBHOOK_URL = `http://127.0.0.1:${webhook.address().port}/order`;
  process.env.WEBHOOK_SECRET = 'test-secret';
  process.env.RATE_LIMIT_PER_MINUTE = '10';

  await new Promise((r) => server.listen(0, r));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => {
  server.close();
  webhook.close();
});

test.beforeEach(() => resetRateLimit());

const post = (path, body) =>
  fetch(baseUrl + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('geçerli sipariş secret header ile webhook\'a iletilir', async () => {
  received.length = 0;
  const res = await post('/api/order', order);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, forwarded: true });
  assert.equal(received.length, 1);
  assert.equal(received[0].headers['x-atolyekart-secret'], 'test-secret');
  assert.equal(received[0].body.event, 'order.create');
  assert.equal(received[0].body.productName, 'Toprak Ton Kupa');
  assert.ok(received[0].body.timestamp);
});

test('geçersiz form 400 döner ve webhook çağrılmaz', async () => {
  received.length = 0;
  const res = await post('/api/order', { ...order, email: 'a@b' });
  assert.equal(res.status, 400);
  assert.ok((await res.json()).errors.email);
  assert.equal(received.length, 0);
});

test('dakikada 10 istekten sonrası 429 döner', async () => {
  for (let i = 0; i < 10; i++) {
    assert.equal((await post('/api/order', { ...order, email: 'x' })).status, 400);
  }
  const res = await post('/api/order', order);
  assert.equal(res.status, 429);
  assert.ok(res.headers.get('retry-after'));
});

test('GET isteği 405 döner', async () => {
  const res = await fetch(baseUrl + '/api/order');
  assert.equal(res.status, 405);
});

test('webhook adresi yoksa geliştirmede payload loglanıp 200 döner', async () => {
  const res = await post('/api/stock-notify', {
    name: 'Ayşe',
    email: 'ayse@example.com',
    productId: 'mum-karanlik',
    consent: true,
  });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, forwarded: false });
});

test('dev sunucusu .env ve api kaynaklarını dışarı sunmaz', async () => {
  assert.equal((await fetch(baseUrl + '/.env.example')).status, 404);
  assert.equal((await fetch(baseUrl + '/api/_lib/validation.js')).status, 404);
  assert.equal((await fetch(baseUrl + '/src/data/products.json')).status, 200);
});
