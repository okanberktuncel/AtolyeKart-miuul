const { createFormHandler } = require('./_lib/formHandler');
const { validateOrder } = require('./_lib/validation');

module.exports = createFormHandler({
  name: 'order',
  validate: validateOrder,
  webhookEnv: 'N8N_ORDER_WEBHOOK_URL',
});
