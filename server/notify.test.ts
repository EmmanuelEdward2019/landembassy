import { test } from "node:test";
import assert from "node:assert/strict";
import { buildEmail, DEFAULT_ADMIN_EMAIL } from "./notify.js";

test("notification goes to the admin email with the customer as reply-to", () => {
  delete process.env.ADMIN_EMAIL;
  const email = buildEmail({
    subject: "New contact message from Ada",
    replyTo: "ada@example.com",
    fields: [["Name", "Ada"], ["Phone", null], ["Message", "Hello"]],
  });
  assert.equal(email.to, DEFAULT_ADMIN_EMAIL);
  assert.equal(email.replyTo, "ada@example.com");
  assert.equal(email.text, "Name: Ada\n\nMessage: Hello");
});

test("customer input is escaped in HTML and kept on one line in the subject", () => {
  const email = buildEmail({
    subject: "New quote request from Eve\r\nBcc: victim@example.com",
    replyTo: "eve@example.com",
    fields: [["Message", "<script>alert(1)</script>"]],
  });
  assert.ok(!email.subject.includes("\n"));
  assert.ok(!email.html.includes("<script>"));
  assert.ok(email.html.includes("&lt;script&gt;"));
});
