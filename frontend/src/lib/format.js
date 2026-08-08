// Static build: requests to this base are intercepted by lib/staticApi.js
// and answered from src/data/site.json. No server is contacted.
export const API = "/api";

export const DEFAULT_WHATSAPP = "96871146738";

// Prices: 3 decimals, the Omani convention (12.500 ر.ع).
// In Arabic the currency follows the number; in English it leads it.
export function formatOMR(price, currencyLabel = "OMR") {
  const n = Number(price || 0);
  const value = n.toFixed(3);
  const isArabicLabel = /[\u0600-\u06FF]/.test(currencyLabel);
  return isArabicLabel ? `${value} ${currencyLabel}` : `${currencyLabel} ${value}`;
}

// Whole-number thresholds read better unrounded: "5 ر.ع" not "5.000 ر.ع".
export function formatOMRCompact(price, currencyLabel = "OMR") {
  const n = Number(price || 0);
  if (!Number.isInteger(n)) return formatOMR(n, currencyLabel);
  const isArabicLabel = /[\u0600-\u06FF]/.test(currencyLabel);
  return isArabicLabel ? `${n} ${currencyLabel}` : `${currencyLabel} ${n}`;
}

// Images live in /public. Absolute URLs pass through untouched.
export function resolveImage(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return url.startsWith("/") ? url : `/${url}`;
}

// Pure helper: number comes from admin-editable settings.whatsapp (via useWaLink hook)
export function waLink(message, number) {
  const digits = String(number || "").replace(/[^\d]/g, "") || DEFAULT_WHATSAPP;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

// Share URL. Static hosting cannot server-render per-product OG tags, so this
// points at the SPA route. See README for restoring rich WhatsApp previews.
export function shareLink(id) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/product/${id}`;
}

// Product order message per spec
export function productOrderMessage(t, name, price, id) {
  const url = id ? shareLink(id) : window.location.href;
  return `${t.whatsapp.orderIntro}\n${name}\n${t.whatsapp.priceLabel}: ${Number(price || 0).toFixed(3)} ر.ع\n${url}`;
}
