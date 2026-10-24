// Yerel geliştirme sunucusu: statik dosyaları sunar ve /api/* isteklerini api/ klasöründeki
// handler'lara yönlendirir. Böylece Vercel hesabı olmadan formlar uçtan uca test edilebilir.
// Kullanım: npm run dev  (ortam değişkenleri .env.local dosyasından okunur)

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT) || 3000;

try {
  process.loadEnvFile(path.join(ROOT, '.env.local'));
} catch {
  // .env.local yoksa sorun değil: webhook adresi tanımsızsa API payload'ı sadece loglar.
}

const API_ROUTES = {
  '/api/order': require('../api/order'),
  '/api/stock-notify': require('../api/stock-notify'),
};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  const apiHandler = API_ROUTES[pathname];
  if (apiHandler) return apiHandler(req, res);

  const filePath = path.join(ROOT, pathname === '/' ? 'index.html' : decodeURIComponent(pathname));
  const blocked = !filePath.startsWith(ROOT + path.sep) || /[\\/](\.env|\.git|api|scripts|node_modules)/.test(filePath.slice(ROOT.length));
  if (blocked) {
    res.statusCode = 404;
    return res.end('Not found');
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      return res.end('Not found');
    }
    res.setHeader('Content-Type', MIME[path.extname(filePath)] || 'application/octet-stream');
    res.end(data);
  });
});

if (require.main === module) {
  server.listen(PORT, () => console.log(`AtölyeKart dev sunucusu: http://localhost:${PORT}`));
}

module.exports = { server };
