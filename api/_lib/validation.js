// Sipariş ve stok bildirimi formlarının sunucu tarafı doğrulaması.
// Tarayıcıdaki kontroller kullanıcı kolaylığı içindir; asıl güvenlik burada sağlanır.

const { products } = require('../../src/data/products.json');

const EMAIL_RE = /^[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,}$/i;
const TR_MOBILE_RE = /^(?:\+90|0)?5\d{9}$/;
const INTERNATIONAL_RE = /^\+\d{10,15}$/;
const SOURCES = ['web', 'mobile'];
const MAX_QUANTITY = 20;

function cleanText(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function validateName(value, errors) {
  const name = cleanText(value);
  if (name.length < 2 || name.length > 80) errors.name = 'Ad soyad 2-80 karakter olmalı.';
  return name;
}

function validateEmail(value, errors) {
  const email = cleanText(value).toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) errors.email = 'Geçerli bir e-posta adresi girin.';
  return email;
}

function validatePhone(value, errors) {
  const phone = cleanText(value).replace(/[\s\-().]/g, '');
  if (!TR_MOBILE_RE.test(phone) && !INTERNATIONAL_RE.test(phone)) {
    errors.phone = 'Geçerli bir telefon numarası girin (ör. 0532 123 45 67).';
  }
  return phone;
}

function validateConsent(value, errors) {
  if (value !== true) errors.consent = 'Devam etmek için açık rıza kutusunu işaretleyin.';
}

function findProduct(productId, errors) {
  const product = products.find((p) => p.id === productId);
  if (!product) errors.productId = 'Ürün bulunamadı.';
  return product;
}

function validateSource(value) {
  return SOURCES.includes(value) ? value : 'web';
}

function validateOrder(body) {
  const errors = {};
  const name = validateName(body.name, errors);
  const phone = validatePhone(body.phone, errors);
  const email = validateEmail(body.email, errors);
  const quantity = Number(body.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    errors.quantity = `Adet 1-${MAX_QUANTITY} arasında olmalı.`;
  }
  const product = findProduct(body.productId, errors);
  if (product && !product.inStock) errors.productId = 'Bu ürün tükendi; stok bildirimi isteyebilirsiniz.';
  validateConsent(body.consent, errors);

  if (Object.keys(errors).length > 0) return { errors };
  return {
    payload: {
      event: 'order.create',
      name,
      productId: product.id,
      productName: product.title,
      phone,
      email,
      quantity,
      source: validateSource(body.source),
    },
  };
}

function validateStockNotify(body) {
  const errors = {};
  const name = validateName(body.name, errors);
  const email = validateEmail(body.email, errors);
  const product = findProduct(body.productId, errors);
  if (product && product.inStock) errors.productId = 'Bu ürün zaten stokta; doğrudan sipariş verebilirsiniz.';
  validateConsent(body.consent, errors);

  if (Object.keys(errors).length > 0) return { errors };
  return {
    payload: {
      event: 'stock.notify',
      name,
      productId: product.id,
      productName: product.title,
      email,
      source: validateSource(body.source),
    },
  };
}

module.exports = { validateOrder, validateStockNotify };
