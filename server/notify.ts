import nodemailer, { type Transporter } from "nodemailer";
import { log } from "./log.js";

export const DEFAULT_ADMIN_EMAIL = "landembassyltd@gmail.com";

export type Notification = {
  subject: string;
  replyTo: string;
  fields: [label: string, value: string | null | undefined][];
};

let transporter: Transporter | null | undefined;

// Built lazily so the env is read at first use (tests, serverless cold starts).
// Returns null when SMTP isn't configured, which disables notifications.
function getTransporter(): Transporter | null {
  if (transporter !== undefined) return transporter;

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    log("SMTP_USER/SMTP_PASS not set: admin email notifications are disabled");
    transporter = null;
    return transporter;
  }

  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user, pass },
    // Fail fast: the form submission waits on this
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  return transporter;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildEmail({ subject, replyTo, fields }: Notification) {
  const rows = fields.filter(([, value]) => value);
  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n\n");
  const html = `
    <h2 style="font-family:Arial,sans-serif;color:#111">${escapeHtml(subject)}</h2>
    <table style="font-family:Arial,sans-serif;border-collapse:collapse" cellpadding="8">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <td style="vertical-align:top;font-weight:bold;color:#555;white-space:nowrap">${escapeHtml(label)}</td>
          <td style="white-space:pre-wrap">${escapeHtml(value!)}</td>
        </tr>`,
        )
        .join("")}
    </table>
    <p style="font-family:Arial,sans-serif;color:#888;font-size:12px">
      Reply to this email to respond to the customer directly.
    </p>`;

  return {
    to: process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL,
    // Customer input goes into a header: keep it on one line
    subject: subject.replace(/[\r\n]+/g, " ").slice(0, 200),
    replyTo,
    text,
    html,
  };
}

// Never throws: a failed email must not fail the customer's submission,
// which is already saved and visible in the admin dashboard.
export async function notifyAdmin(notification: Notification) {
  const mailer = getTransporter();
  if (!mailer) return;

  try {
    await mailer.sendMail({
      from: `"Land Embassy Website" <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
      ...buildEmail(notification),
    });
  } catch (error) {
    console.error("Failed to send admin notification:", error);
  }
}
