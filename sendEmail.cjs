const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@letsmoveit-right.com";
const CC_EMAILS = (process.env.NOTIFICATIONS_CC || "").split(",").filter(Boolean);
const BCC_EMAILS = (process.env.NOTIFICATIONS_BCC || "").split(",").filter(Boolean);

const COMPANY = {
  name: "Let's Move It Right",
  tagline: "Full Service Moving Company",
  phone: "1-800-956-1118",
  fullAddress: "503 Jessie Street, San Fernando, CA 91340",
  domain: "https://www.letsmoveit-right.com",
};

// ── Helpers ──────────────────────────────────────────────────────

function esc(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label, value, opts = {}) {
  const border = opts.last ? "" : "border-bottom:1px solid #f0f0f0;";
  const val = opts.raw ? value : esc(value);
  const weight = opts.highlight ? "color:#1a1a2e;font-weight:600;" : "color:#333333;";
  const wrap = opts.multiline ? "white-space:pre-wrap;" : "";
  return `<tr>
    <td style="padding:12px 0;${border}width:140px;vertical-align:top;">
      <span style="font-size:12px;font-weight:600;color:#888888;text-transform:uppercase;letter-spacing:0.5px;">${label}</span>
    </td>
    <td style="padding:12px 0 12px 12px;${border}vertical-align:top;">
      <span style="font-size:15px;${weight}${wrap}">${val}</span>
    </td>
  </tr>`;
}

function link(href, text) {
  return `<a href="${esc(href)}" style="color:#1a73e8;text-decoration:none;">${esc(text)}</a>`;
}

function shell(title, bodyRows) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <tr>
          <td style="background-color:#1a1a2e;padding:28px 32px;text-align:center;">
            <h1 style="margin:0;font-size:22px;color:#f5c518;letter-spacing:0.5px;">${esc(COMPANY.name)}</h1>
            <p style="margin:4px 0 0;font-size:12px;color:#aaaacc;text-transform:uppercase;letter-spacing:1.5px;">${esc(COMPANY.tagline)}</p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f5c518;padding:12px 32px;text-align:center;">
            <strong style="font-size:14px;color:#1a1a2e;text-transform:uppercase;letter-spacing:0.5px;">${esc(title)}</strong>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${bodyRows}
            </table>
          </td>
        </tr>
        <tr>
          <td style="background-color:#fafafa;padding:20px 32px;border-top:1px solid #eeeeee;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;color:#888888;">${esc(COMPANY.name)} &bull; ${esc(COMPANY.fullAddress)}</p>
            <p style="margin:0;font-size:12px;color:#888888;">${esc(COMPANY.phone)} &bull; <a href="${COMPANY.domain}" style="color:#1a73e8;text-decoration:none;">letsmoveit-right.com</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Build branded emails ─────────────────────────────────────────

function buildQuoteEmail(d) {
  const now = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
  const rows = [
    row("Name", d.name, { highlight: true }),
    row("Email", link(`mailto:${d.email}`, d.email), { raw: true }),
    row("Phone", link(`tel:${d.phone}`, d.phone), { raw: true }),
    row("Moving From", d.movingFrom),
    row("Moving To", d.movingTo),
    row("Move Size", d.moveSize),
    row("Move Date", d.moveDate),
    row("Submitted", now, { last: true }),
  ].join("\n");

  return {
    subject: `New Moving Quote Request — ${d.name}`,
    html: shell("New Moving Quote Request", rows),
    text: [
      "New Moving Quote Request",
      "",
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `Phone: ${d.phone}`,
      `Moving From: ${d.movingFrom}`,
      `Moving To: ${d.movingTo}`,
      `Move Size: ${d.moveSize}`,
      `Move Date: ${d.moveDate}`,
    ].join("\n"),
  };
}

function buildContactEmail(d) {
  const now = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
  const rows = [
    row("Inquiry Type", d.typeLabel, { highlight: true }),
    row("Name", d.name, { highlight: true }),
    row("Email", link(`mailto:${d.email}`, d.email), { raw: true }),
    row("Phone", link(`tel:${d.phone}`, d.phone), { raw: true }),
    ...(d.orderNumber ? [row("Order #", d.orderNumber)] : []),
    row("Message", d.message, { multiline: true }),
    row("Submitted", now, { last: true }),
  ].join("\n");

  const lines = [
    "Customer Support Inquiry",
    "",
    `Type: ${d.typeLabel}`,
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Phone: ${d.phone}`,
  ];
  if (d.orderNumber) lines.push(`Order #: ${d.orderNumber}`);
  lines.push(`Message: ${d.message}`);

  return {
    subject: `[${d.typeLabel}] Contact Form — ${d.name}`,
    html: shell(`Contact Form — ${d.typeLabel}`, rows),
    text: lines.join("\n"),
  };
}

// ── Send via Resend ──────────────────────────────────────────────

async function sendQuoteEmail(data, toAddresses) {
  if (!toAddresses || !toAddresses.length) {
    console.error("sendQuoteEmail: no recipients — set NOTIFICATIONS_EMAILS in .env");
    return;
  }
  if (!process.env.RESEND_API_KEY) {
    console.error("sendQuoteEmail: RESEND_API_KEY is not set");
    return;
  }

  const email = buildQuoteEmail(data);
  const payload = {
    from: FROM_EMAIL,
    to: toAddresses,
    replyTo: data.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
  };
  if (CC_EMAILS.length) payload.cc = CC_EMAILS;
  if (BCC_EMAILS.length) payload.bcc = BCC_EMAILS;

  const { error } = await resend.emails.send(payload);
  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
}

async function sendContactEmail(data, toAddresses) {
  if (!toAddresses || !toAddresses.length) {
    console.error("sendContactEmail: no recipients — set NOTIFICATIONS_EMAILS in .env");
    return;
  }
  if (!process.env.RESEND_API_KEY) {
    console.error("sendContactEmail: RESEND_API_KEY is not set");
    return;
  }

  const email = buildContactEmail(data);
  const payload = {
    from: FROM_EMAIL,
    to: toAddresses,
    replyTo: data.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
  };
  if (CC_EMAILS.length) payload.cc = CC_EMAILS;
  if (BCC_EMAILS.length) payload.bcc = BCC_EMAILS;

  const { error } = await resend.emails.send(payload);
  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
}

module.exports = { sendQuoteEmail, sendContactEmail };
