import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "net";
import type { Server } from "http";

const ADMIN_TOKEN = "test-admin-token-0123456789abcdef";
process.env.ADMIN_TOKEN = ADMIN_TOKEN;
delete process.env.DATABASE_URL;

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

// Keep last: it exhausts the shared submission rate limit
test("public submissions are rate limited", async () => {
  let status = 0;
  for (let i = 0; i < 15 && status !== 429; i++) {
    status = (await post("/api/contacts", { name: "Ada", email: "ada@example.com", message: "Hi" })).status;
  }
  assert.equal(status, 429);
});
