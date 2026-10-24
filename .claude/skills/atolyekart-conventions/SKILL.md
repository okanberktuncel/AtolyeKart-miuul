---
name: atolyekart-conventions
description: Use when adding or editing a component in AtölyeKart's index.html or Expo app, adding or changing product data, touching the order / stock-notify forms or API routes, or building an n8n workflow that consumes their webhook payloads — defines the single-file component rule, the shared data file, and the exact JSON contract for the two events.
---

# AtölyeKart Conventions

## Overview

AtölyeKart has three parts that must stay in sync:

- `index.html`: a single no-build React 18 UMD + Babel Standalone page, all components inline.
- `mobile/`: an Expo app with the same products and forms.
- `api/`: Vercel serverless functions that validate the forms and forward them to n8n.

This skill fixes the four things that are easy to get wrong: where component code lives, where product data lives, how forms are sent, and the exact webhook payload shape.

## Component Rule (web)

- Every component is a **function component** defined inside `index.html`'s `<script type="text/babel">` block. No class components, no per-component files, no build step.
- One function = one component. Shared form logic lives in small helpers (`Modal`, `ConsentCheckbox`, `useFormSubmit`, `SuccessView`) in the same block.

## Product Data

- The single source is `src/data/products.json`: `{ "categories": [...], "products": [...] }`.
- The web page `fetch`es it before the first render. Mobile imports it through `mobile/data/products.ts`, and `mobile/metro.config.js` adds the repo root to `watchFolders`. The API `require`s it for server-side `productId` checks, and n8n reads it over HTTP from the deployed site.
- Never copy product arrays into a component, `mobile/`, or an n8n Code node.
- Product fields: `id`, `category`, `title`, `description`, `price`, `unit`, `image`, `inStock`.
- The `id` format is `{category}-{short-slug}` (for example `mum-lavanta`). Use 1-2 words from the title.
- `image` must be a real, verified URL (check it with `curl -I`), never a placeholder.
- `inStock: false` swaps "Sipariş Ver" for "Stok Bildirimi İste". The API rejects orders for products that are out of stock, and rejects stock requests for products that are in stock.

## Sending Forms

- Clients (web and mobile) never call n8n or any webhook directly. They `POST` JSON to `/api/order` or `/api/stock-notify`, through `postForm` on web or `mobile/lib/formApi.ts` on mobile.
- The client sends: the form fields, `productId`, `consent: true`, and `source` (`'web'` or `'mobile'`).
- The API owns validation, the rate limit (`RATE_LIMIT_PER_MINUTE`, default 10 per IP), the webhook URLs (`N8N_ORDER_WEBHOOK_URL`, `N8N_STOCK_WEBHOOK_URL`) and the `X-Atolyekart-Secret` header (`WEBHOOK_SECRET`). None of these ever reach the browser.
- Responses: `200 { ok, forwarded }` · `400 { error, errors: { field: message } }` · `405` · `429` (with `Retry-After`) · `502` when n8n fails.

## Webhook Data Contract (API → n8n)

The API adds `timestamp` (ISO 8601 UTC, `new Date().toISOString()`) to the validated payload. Field names are fixed by the course brief. Never rename them or add fields to them.

### `order.create`
```json
{
  "event": "order.create",
  "name": "Ayşe Yılmaz",
  "productId": "seramik-kupa",
  "productName": "Toprak Ton Kupa",
  "phone": "05321234567",
  "email": "ayse@example.com",
  "quantity": 2,
  "source": "web",
  "timestamp": "2026-10-24T10:00:00.000Z"
}
```

### `stock.notify`
```json
{
  "event": "stock.notify",
  "name": "Ayşe Yılmaz",
  "productId": "mum-karanlik",
  "productName": "Gece Kokusu Mumu",
  "email": "ayse@example.com",
  "source": "mobile",
  "timestamp": "2026-10-24T10:00:00.000Z"
}
```

n8n must reject any request whose `X-Atolyekart-Secret` header does not match its own `WEBHOOK_SECRET`.

## Quick Reference

| Rule | Detail |
|---|---|
| Component location | Inside `index.html`, function component only, one file total |
| Product data | `src/data/products.json` only |
| Form submit | Client → `/api/order` or `/api/stock-notify`, never a webhook |
| Secrets | `.env.local` (git-ignored) and Vercel env vars only |
| Payload fields | Exactly the contract above + `timestamp` |
| Tests | `npm test` (node:test, no dependencies) |

## Common Mistakes

- Putting a webhook URL or secret in `index.html` or `mobile/`. They are visible to anyone.
- Adding a field to the payload in only one place. Change `api/_lib/validation.js`, the tests and this contract together.
- Editing `mobile/data/products.ts` to add a product. Edit `src/data/products.json` instead.
- Opening `index.html` via `file://`. The data `fetch` fails, so run it with `npm run dev`.
- Leaving `image` as a placeholder string instead of a verified real URL.
