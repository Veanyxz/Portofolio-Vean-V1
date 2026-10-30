// netlify/functions/guestbook.js
// Guestbook API: GET -> list entries, POST -> append entry.
// Storage: Netlify Blobs (no external DB, no credentials in the repo).

const { getStore } = require("@netlify/blobs");

const STORE = "guestbook";
const KEY = "entries.json";
const MAX_ITEMS = 200;
const MAX_PHOTO_BYTES = 240 * 1024;

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "Access-Control-Allow-Origin": "https://vean.my.id",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
  "X-Content-Type-Options": "nosniff",
};

function json(status, body) {
  return { statusCode: status, headers: JSON_HEADERS, body: JSON.stringify(body) };
}

function clean(v, max) {
  return String(v == null ? "" : v).replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max);
}

// reject data: URLs that are not small base64 JPEG/PNG; keeps blob size bounded
function sanitizePhoto(src) {
  const s = String(src || "");
  if (!s.startsWith("data:image/")) return "";
  const comma = s.indexOf(",");
  if (comma < 0) return "";
  const head = s.slice(0, comma);
  if (!/^data:image\/(jpeg|png|webp);base64$/.test(head)) return "";
  const b64 = s.slice(comma + 1);
  if (!/^[A-Za-z0-9+/=]+$/.test(b64)) return "";
  const bytes = Math.floor(b64.length * 3 / 4);
  if (bytes > MAX_PHOTO_BYTES) return "";
  return s;
}

async function readAll(store) {
  try {
    const data = await store.get(KEY, { type: "json" });
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  } catch (e) {
    return [];
  }
}

exports.handler = async function (event) {
  const method = (event.httpMethod || "GET").toUpperCase();

  if (method === "OPTIONS") {
    return { statusCode: 204, headers: JSON_HEADERS, body: "" };
  }

  let store;
  try {
    store = getStore({ name: STORE, consistency: "strong" });
  } catch (e) {
    return json(500, { error: "storage_unavailable", detail: String(e && e.message || e) });
  }

  if (method === "GET") {
    const items = await readAll(store);
    items.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    return json(200, { items: items.slice(0, MAX_ITEMS), count: items.length });
  }

  if (method === "POST") {
    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch (e) {
      return json(400, { error: "invalid_json" });
    }

    const name = clean(body.name, 40);
    const text = clean(body.text, 600);
    const photo = sanitizePhoto(body.photo);

    if (name.length < 2) return json(400, { error: "Nama minimal 2 karakter." });
    if (text.length < 3) return json(400, { error: "Pesan minimal 3 karakter." });

    const items = await readAll(store);
    const item = {
      id: (Date.now().toString(36) + Math.random().toString(36).slice(2, 8)),
      name: name,
      text: text,
      photo: photo,
      ts: Date.now(),
    };

    items.unshift(item);
    const trimmed = items.slice(0, MAX_ITEMS);

    try {
      await store.setJSON(KEY, trimmed);
    } catch (e) {
      return json(500, { error: "write_failed", detail: String(e && e.message || e) });
    }

    return json(200, { item: item, count: trimmed.length });
  }

  return json(405, { error: "method_not_allowed" });
};
