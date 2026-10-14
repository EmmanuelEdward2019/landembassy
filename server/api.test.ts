import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "net";
import type { Server } from "http";

const ADMIN_TOKEN = "test-admin-token-0123456789abcdef";
process.env.ADMIN_TOKEN = ADMIN_TOKEN;
// In-memory storage by default; set TEST_DATABASE_URL (a freshly migrated
// database) to run the same tests against Postgres.
if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
} else {
  delete process.env.DATABASE_URL;
}
delete process.env.BLOB_READ_WRITE_TOKEN;

const { createApp } = await import("./app.js");

let server: Server;
let baseUrl: string;

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

after(() => {
  server.close();
});

const auth = { Authorization: `Bearer ${ADMIN_TOKEN}` };

function post(path: string, body: unknown) {
  return fetch(baseUrl + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validQuote = {
  name: "Ada Obi",
  email: "ada@example.com",
  phone: "+2348000000000",
  propertyInterest: "Residential",
  budgetRange: "₦50M - ₦100M",
  message: "Looking for a 3 bedroom flat in Lekki",
  preferredContact: "email",
};

test("admin endpoints reject missing and wrong tokens", async () => {
  assert.equal((await fetch(`${baseUrl}/api/quotes`)).status, 401);
  assert.equal(
    (await fetch(`${baseUrl}/api/contacts`, { headers: { Authorization: "Bearer wrong" } })).status,
    401,
  );
  assert.equal((await fetch(`${baseUrl}/api/admin/session`, { headers: auth })).status, 200);
});

test("admin endpoints are disabled when ADMIN_TOKEN is weak or unset", async () => {
  process.env.ADMIN_TOKEN = "short";
  try {
    const res = await fetch(`${baseUrl}/api/quotes`, { headers: { Authorization: "Bearer short" } });
    assert.equal(res.status, 503);
  } finally {
    process.env.ADMIN_TOKEN = ADMIN_TOKEN;
  }
});

test("quote can be submitted, listed and deleted", async () => {
  const created = await post("/api/quotes", validQuote);
  assert.equal(created.status, 201);
  assert.deepEqual(await created.json(), { ok: true });

  const quotes = await (await fetch(`${baseUrl}/api/quotes`, { headers: auth })).json();
  const quote = quotes.find((q: { email: string }) => q.email === validQuote.email);
  assert.ok(quote);

  const del = await fetch(`${baseUrl}/api/quotes/${quote.id}`, { method: "DELETE", headers: auth });
  assert.equal(del.status, 204);
  const again = await fetch(`${baseUrl}/api/quotes/${quote.id}`, { method: "DELETE", headers: auth });
  assert.equal(again.status, 404);
});

test("invalid submissions are rejected", async () => {
  assert.equal((await post("/api/quotes", { ...validQuote, email: "not-an-email" })).status, 400);
  assert.equal((await post("/api/quotes", { ...validQuote, preferredContact: "fax" })).status, 400);
  assert.equal((await post("/api/contacts", { name: "A", email: "a@b.co", message: "x".repeat(5001) })).status, 400);
});

test("contact phone is optional", async () => {
  const res = await post("/api/contacts", { name: "Ada", email: "ada@example.com", phone: "", message: "Hello" });
  assert.equal(res.status, 201);
});

test("honeypot submissions are accepted but not stored", async () => {
  const res = await post("/api/contacts", { name: "Bot", email: "bot@spam.com", message: "Buy now", website: "spam.com" });
  assert.equal(res.status, 201);

  const contacts = await (await fetch(`${baseUrl}/api/contacts`, { headers: auth })).json();
  assert.ok(!contacts.some((c: { email: string }) => c.email === "bot@spam.com"));
});

test("malformed JSON returns 400 without crashing the server", async () => {
  const res = await fetch(`${baseUrl}/api/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{not json",
  });
  assert.equal(res.status, 400);
  assert.equal((await fetch(`${baseUrl}/api/admin/session`, { headers: auth })).status, 200);
});

test("unknown API routes return JSON 404", async () => {
  const res = await fetch(`${baseUrl}/api/nope`);
  assert.equal(res.status, 404);
  assert.equal(res.headers.get("x-powered-by"), null);
});

const validProperty = {
  title: "3 Bedroom Flat",
  description: "Serviced flat",
  listingType: "rent",
  status: "available",
  propertyType: "residential",
  price: 4500000,
  location: "Yaba, Lagos",
  bedrooms: 3,
  bathrooms: 3,
  area: 140,
  images: ["https://images.unsplash.com/photo-1?w=1200"],
  features: ["Parking"],
  featured: false,
};

function adminSend(method: string, path: string, body: unknown) {
  return fetch(baseUrl + path, {
    method,
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("seeded properties are public, with original ids", async () => {
  const res = await fetch(`${baseUrl}/api/properties`);
  assert.equal(res.status, 200);
  const properties = await res.json();
  assert.equal(properties.length, 6);
  assert.ok(properties[0].featured, "featured listings come first");
  const duplex = await (await fetch(`${baseUrl}/api/properties/1`)).json();
  assert.equal(duplex.title, "Luxury 5 Bedroom Duplex");
  assert.equal(duplex.price, 85000000);
});

test("property admin endpoints require the token", async () => {
  assert.equal((await fetch(`${baseUrl}/api/admin/properties`)).status, 401);
  const res = await fetch(`${baseUrl}/api/admin/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validProperty),
  });
  assert.equal(res.status, 401);
});

test("property can be created, edited, status-changed and deleted", async () => {
  const created = await adminSend("POST", "/api/admin/properties", validProperty);
  assert.equal(created.status, 201);
  const property = await created.json();
  assert.equal(property.pricePeriod, "year", "rentals default to a yearly price");

  const edited = await adminSend("PUT", `/api/admin/properties/${property.id}`, {
    ...validProperty,
    listingType: "sale",
    pricePeriod: "month",
    price: 60000000,
  });
  assert.equal(edited.status, 200);
  const sale = await edited.json();
  assert.equal(sale.pricePeriod, null, "sale prices have no period");
  assert.equal(sale.price, 60000000);

  const patched = await adminSend("PATCH", `/api/admin/properties/${property.id}`, { status: "sold", featured: true });
  assert.equal((await patched.json()).status, "sold");

  const del = await fetch(`${baseUrl}/api/admin/properties/${property.id}`, { method: "DELETE", headers: auth });
  assert.equal(del.status, 204);
  assert.equal((await fetch(`${baseUrl}/api/properties/${property.id}`)).status, 404);
});

test("off-market properties are hidden from the public site but not the admin", async () => {
  const property = await (await adminSend("POST", "/api/admin/properties", { ...validProperty, status: "off_market" })).json();
  assert.equal((await fetch(`${baseUrl}/api/properties/${property.id}`)).status, 404);
  const publicList = await (await fetch(`${baseUrl}/api/properties`)).json();
  assert.ok(!publicList.some((p: { id: string }) => p.id === property.id));
  const adminList = await (await fetch(`${baseUrl}/api/admin/properties`, { headers: auth })).json();
  assert.ok(adminList.some((p: { id: string }) => p.id === property.id));
});

test("invalid property data is rejected", async () => {
  assert.equal((await adminSend("POST", "/api/admin/properties", { ...validProperty, listingType: "swap" })).status, 400);
  assert.equal((await adminSend("POST", "/api/admin/properties", { ...validProperty, price: -1 })).status, 400);
  assert.equal(
    (await adminSend("POST", "/api/admin/properties", { ...validProperty, images: ["javascript:alert(1)"] })).status,
    400,
  );
  assert.equal((await adminSend("PATCH", "/api/admin/properties/1", { title: "Nope" })).status, 400);
});

test("inquiry status can be updated", async () => {
  await post("/api/contacts", { name: "Status", email: "status@example.com", message: "Hi" });
  const contacts = await (await fetch(`${baseUrl}/api/contacts`, { headers: auth })).json();
  const contact = contacts.find((c: { email: string }) => c.email === "status@example.com");
  assert.equal(contact.status, "new");
  const res = await adminSend("PATCH", `/api/contacts/${contact.id}`, { status: "contacted" });
  assert.equal((await res.json()).status, "contacted");
  assert.equal((await adminSend("PATCH", `/api/contacts/${contact.id}`, { status: "spam" })).status, 400);
});

test("image upload reports when Vercel Blob isn't configured", async () => {
  const res = await fetch(`${baseUrl}/api/admin/uploads`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "image/jpeg" },
    body: new Uint8Array([0xff, 0xd8, 0xff]),
  });
  assert.equal(res.status, 503);
  const session = await (await fetch(`${baseUrl}/api/admin/session`, { headers: auth })).json();
  assert.equal(session.uploads, false);
});

// Keep last: it exhausts the shared submission rate limit
test("public submissions are rate limited", async () => {
  let status = 0;
  for (let i = 0; i < 15 && status !== 429; i++) {
    status = (await post("/api/contacts", { name: "Ada", email: "ada@example.com", message: "Hi" })).status;
  }
  assert.equal(status, 429);
});
