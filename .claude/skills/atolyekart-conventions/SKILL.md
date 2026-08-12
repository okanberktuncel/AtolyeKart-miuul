---
name: atolyekart-conventions
description: Use when adding or editing a component in AtölyeKart's index.html, adding demo/mock product data, or constructing a cart-save / favorite-save webhook payload — defines the single-file component rule, the demo data location, and the exact JSON contract for those two events.
---

# AtölyeKart Conventions

## Overview

AtölyeKart's `index.html` is a single no-build file: React 18 UMD + Babel Standalone loaded via CDN, all components defined inline. This skill fixes two things that are easy to get wrong when extending it: where component code and demo data live, and the exact JSON shape webhook payloads must have.

## Component Rule

- Every component is a **function component** defined inside `index.html`'s `<script type="text/babel">` block. No class components, no per-component files, no build step.
- One function = one component. Don't split a single component's JSX across multiple `<script>` blocks.
- Demo/mock data does NOT live inline in a component. It lives in `src/data/card.js` (the project's single data file — covers all product/demo data, not just literal "card" UI elements), loaded via a plain `<script src="src/data/card.js"></script>` tag placed BEFORE the Babel script, so it's available as a global before `App` renders.
- `id` for a data entry is `{category}-{kebab-case-short-slug-of-title}`, e.g. title "Lavanta Mumu" in category `mum` → `mum-lavanta`. Keep it short (1-2 words from the title), not the full slugified title.
- `image` is a real, working image URL (verify with `curl -I` before adding) — never a placeholder string like `'...'` or a local path that doesn't exist.

`src/data/card.js` (classic script, not ES module — Babel Standalone doesn't resolve imports):
```js
// src/data/card.js
window.CARD_DATA = {
  products: [
    { id: 'seramik-kupa', category: 'seramik', title: 'Toprak Ton Kupa', price: 320, unit: 'adet', image: 'https://images.unsplash.com/photo-...' },
  ],
};
```

In `index.html`:
```html
<script src="src/data/card.js"></script>
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
  const PRODUCTS = window.CARD_DATA.products;
  function ProductCard({ product }) { /* ... */ }
</script>
```

## Webhook Data Contract

Two events, one envelope shape: `{ event, timestamp, ...payload }`.
- `timestamp` is generated at call time: `new Date().toISOString()` (ISO 8601 UTC).
- Field names on any product always match `src/data/card.js`: `id`, `category`, `title`, `price`, `unit` (+ `qty` only inside cart items). Never rename or add ad-hoc fields per event.
- Send with a plain `fetch(WEBHOOK_URL, { method: 'POST', body: JSON.stringify(payload) })` from a single shared `sendWebhook(event, payload)` helper — don't inline fetch calls in multiple components.

### `cart.save`
Sent when the cart is persisted (e.g. on checkout or explicit "save").
```json
{
  "event": "cart.save",
  "timestamp": "2026-08-12T10:00:00Z",
  "cart": {
    "items": [
      { "id": "seramik-kupa", "title": "Toprak Ton Kupa", "category": "seramik", "price": 320, "unit": "adet", "qty": 2 }
    ],
    "totalItemCount": 2,
    "totalPrice": 640
  }
}
```

### `favorite.save`
Sent when a single product is added to favorites.
```json
{
  "event": "favorite.save",
  "timestamp": "2026-08-12T10:00:00Z",
  "product": { "id": "taki-kolye", "title": "Boncuk Detaylı Kolye", "category": "taki", "price": 350, "unit": "adet" }
}
```

`favorite.remove` and `cart.update` mirror the same shape with a different `event` value — don't invent new field names for them.

## Quick Reference

| Rule | Detail |
|---|---|
| Component location | Inside `index.html`, function component only, one file total |
| Demo/mock data | `src/data/card.js`, classic script loaded before the Babel script |
| `id` format | `{category}-{short-slug}` |
| `image` | Real, verified URL — never a placeholder |
| Webhook envelope | `{ event, timestamp, ...payload }`, `timestamp` = `new Date().toISOString()` |
| Webhook sending | Single shared `sendWebhook(event, payload)` helper, not inlined `fetch` calls |
| Field names | `id`, `category`, `title`, `price`, `unit` (+ `qty` in cart items) |

## Common Mistakes

- Adding a new `<script src="components/X.js">` per component — breaks the single-file rule.
- Inlining product/demo arrays directly in a component instead of `src/data/card.js`.
- Using `productId` in a webhook payload instead of `id` — inconsistent with `src/data/card.js`.
- Using ES `import`/`export` in `src/data/card.js` — Babel Standalone won't resolve module imports; use `window.CARD_DATA` instead.
- Leaving `image` as a placeholder string instead of a verified real URL.
- Calling `fetch` directly from inside a component instead of going through `sendWebhook`.
