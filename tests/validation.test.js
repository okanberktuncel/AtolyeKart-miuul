const test = require('node:test');
const assert = require('node:assert/strict');

const { validateOrder, validateStockNotify } = require('../api/_lib/validation');

const validOrder = {
  name: 'Ayşe Yılmaz',
  phone: '0532 123 45 67',
  email: 'ayse@example.com',
  quantity: 2,
  productId: 'seramik-kupa',
  consent: true,
  source: 'web',
};

test('geçerli sipariş ödev sözleşmesindeki alanlarla payload üretir', () => {
  const { errors, payload } = validateOrder(validOrder);
  assert.equal(errors, undefined);
  assert.deepEqual(payload, {
    event: 'order.create',
    name: 'Ayşe Yılmaz',
    productId: 'seramik-kupa',
    productName: 'Toprak Ton Kupa',
    phone: '05321234567',
    email: 'ayse@example.com',
    quantity: 2,
    source: 'web',
  });
});

test('TLD içermeyen e-posta reddedilir', () => {
  for (const email of ['a@b', 'ayse@', '@example.com', 'ayse example@x.com']) {
    const { errors } = validateOrder({ ...validOrder, email });
    assert.ok(errors && errors.email, `${email} kabul edilmemeli`);
  }
});

test('geçersiz telefon ve adet reddedilir', () => {
  assert.ok(validateOrder({ ...validOrder, phone: '12345' }).errors.phone);
  assert.ok(validateOrder({ ...validOrder, quantity: 0 }).errors.quantity);
  assert.ok(validateOrder({ ...validOrder, quantity: 1.5 }).errors.quantity);
  assert.ok(validateOrder({ ...validOrder, quantity: 21 }).errors.quantity);
});

test('uluslararası telefon formatı kabul edilir', () => {
  assert.equal(validateOrder({ ...validOrder, phone: '+44 7700 900123' }).errors, undefined);
});

test('açık rıza işaretlenmeden sipariş kabul edilmez', () => {
  assert.ok(validateOrder({ ...validOrder, consent: false }).errors.consent);
  assert.ok(validateOrder({ ...validOrder, consent: 'true' }).errors.consent);
});

test('bilinmeyen ve tükenmiş ürüne sipariş verilemez', () => {
  assert.ok(validateOrder({ ...validOrder, productId: 'yok-boyle-urun' }).errors.productId);
  assert.ok(validateOrder({ ...validOrder, productId: 'mum-karanlik' }).errors.productId);
});

test('HTML etiketleri temizlenir, bilinmeyen kaynak web olur', () => {
  const { payload } = validateOrder({ ...validOrder, name: '<b>Ayşe</b>  Yılmaz', source: 'evil' });
  assert.equal(payload.name, 'Ayşe Yılmaz');
  assert.equal(payload.source, 'web');
});

test('stok bildirimi yalnızca tükenmiş ürün için kabul edilir', () => {
  const body = { name: 'Ayşe', email: 'ayse@example.com', productId: 'mum-karanlik', consent: true, source: 'mobile' };
  const { errors, payload } = validateStockNotify(body);
  assert.equal(errors, undefined);
  assert.deepEqual(payload, {
    event: 'stock.notify',
    name: 'Ayşe',
    productId: 'mum-karanlik',
    productName: 'Gece Kokusu Mumu',
    email: 'ayse@example.com',
    source: 'mobile',
  });
  assert.ok(validateStockNotify({ ...body, productId: 'seramik-kupa' }).errors.productId);
});
