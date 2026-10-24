const { createFormHandler } = require('./_lib/formHandler');
const { validateStockNotify } = require('./_lib/validation');

module.exports = createFormHandler({
  name: 'stock-notify',
  validate: validateStockNotify,
  webhookEnv: 'N8N_STOCK_WEBHOOK_URL',
});
