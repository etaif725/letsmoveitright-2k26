import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@letsmoveit-right.com";
const TO_EMAILS = (process.env.NOTIFICATIONS_EMAILS || "").split(",").filter(Boolean);
const CC_EMAILS = (process.env.NOTIFICATIONS_CC || "").split(",").filter(Boolean);
const BCC_EMAILS = (process.env.NOTIFICATIONS_BCC || "").split(",").filter(Boolean);

const COMPANY = {
  name: "Let's Move It Right",
  tagline: "Full Service Moving Company",
  phone: "1-800-956-1118",
  fullAddress: "503 Jessie Street, San Fernando, CA 91340",
  domain: "https://www.letsmoveit-right.com",
};

function esc(s) {
  if (typeof s !== "string") return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function row(label, value, opts = {}) {
  const border = opts.last ? "" : "border-bottom:1px solid #f0f0f0;";
  const val = opts.raw ? value : esc(value);
  const weight = opts.highlight ? "color:#1a1a2e;font-weight:600;" : "color:#333333;";
  const wrap = opts.multiline ? "white-space:pre-wrap;" : "";
  return `<tr>
    <td style="padding:12px 0;${border}width:140px;vertical-align:top;"><span style="font-size:12px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.5px;">${label}</span></td>
    <td style="padding:12px 0 12px 12px;${border}vertical-align:top;"><span style="font-size:15px;${weight}${wrap}">${val}</span></td>
  </tr>`;
}

function link(href, text) {
  return `<a href="${esc(href)}" style="color:#1a73e8;text-decoration:none;">${esc(text)}</a>`;
}

function shell(title, bodyRows) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:32px 16px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
  <tr><td style="background:#1a1a2e;padding:28px 32px;text-align:center;">
    <h1 style="margin:0;font-size:22px;color:#f5c518;letter-spacing:0.5px;">${esc(COMPANY.name)}</h1>
    <p style="margin:4px 0 0;font-size:12px;color:#aaaacc;text-transform:uppercase;letter-spacing:1.5px;">${esc(COMPANY.tagline)}</p>
  </td></tr>
  <tr><td style="background:#f5c518;padding:12px 32px;text-align:center;">
    <strong style="font-size:14px;color:#1a1a2e;text-transform:uppercase;letter-spacing:0.5px;">${esc(title)}</strong>
  </td></tr>
  <tr><td style="padding:28px 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${bodyRows}</table></td></tr>
  <tr><td style="background:#fafafa;padding:20px 32px;border-top:1px solid #eee;text-align:center;">
    <p style="margin:0 0 4px;font-size:12px;color:#888;">${esc(COMPANY.name)} &bull; ${esc(COMPANY.fullAddress)}</p>
    <p style="margin:0;font-size:12px;color:#888;">${esc(COMPANY.phone)} &bull; <a href="${COMPANY.domain}" style="color:#1a73e8;text-decoration:none;">letsmoveit-right.com</a></p>
  </td></tr>
</table>
</td></tr></table></body></html>`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { inquiryType, typeLabel, name, email, phone, orderNumber, message } = req.body || {};

  const errors = [];
  if (!name || typeof name !== "string" || name.trim().length < 2) errors.push("Name is required");
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Valid email required");
  if (!phone || typeof phone !== "string" || phone.replace(/\D/g, "").length < 10) errors.push("Valid phone required");
  if (!message || typeof message !== "string" || message.trim().length < 10) errors.push("Message required (min 10 chars)");

  if (errors.length) {
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  const label = typeLabel || inquiryType || "General";
  const now = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
  const rows = [
    row("Inquiry Type", label, { highlight: true }),
    row("Name", name, { highlight: true }),
    row("Email", link(`mailto:${email}`, email), { raw: true }),
    row("Phone", link(`tel:${phone}`, phone), { raw: true }),
    ...(orderNumber ? [row("Order #", orderNumber)] : []),
    row("Message", message, { multiline: true }),
    row("Submitted", now, { last: true }),
  ].join("\n");

  const lines = [`Type: ${label}`, `Name: ${name}`, `Email: ${email}`, `Phone: ${phone}`];
  if (orderNumber) lines.push(`Order #: ${orderNumber}`);
  lines.push(`Message: ${message}`);

  const payload = {
    from: FROM_EMAIL,
    to: TO_EMAILS,
    replyTo: email,
    subject: `[${label}] Contact Form — ${name}`,
    html: shell(`Contact Form — ${label}`, rows),
    text: lines.join("\n"),
  };
  if (CC_EMAILS.length) payload.cc = CC_EMAILS;
  if (BCC_EMAILS.length) payload.bcc = BCC_EMAILS;

  try {
    const { error } = await resend.emails.send(payload);
    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ error: "Email send failed" });
    }
    return res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Contact error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
