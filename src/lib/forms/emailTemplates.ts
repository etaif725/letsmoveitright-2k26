import { COMPANY } from "@/data/company";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(
  label: string,
  value: string,
  opts: { last?: boolean; multiline?: boolean; highlight?: boolean; raw?: boolean } = {},
): string {
  const border = opts.last ? "" : "border-bottom:1px solid #f0f0f0;";
  const val = opts.raw ? value : escapeHtml(value);
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

function shell(title: string, bodyRows: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <tr>
          <td style="background-color:#1a1a2e;padding:28px 32px;text-align:center;">
            <h1 style="margin:0;font-size:22px;color:#f5c518;letter-spacing:0.5px;">${escapeHtml(COMPANY.name)}</h1>
            <p style="margin:4px 0 0;font-size:12px;color:#aaaacc;text-transform:uppercase;letter-spacing:1.5px;">${escapeHtml(COMPANY.tagline)}</p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f5c518;padding:12px 32px;text-align:center;">
            <strong style="font-size:14px;color:#1a1a2e;text-transform:uppercase;letter-spacing:0.5px;">${escapeHtml(title)}</strong>
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
            <p style="margin:0 0 4px;font-size:12px;color:#888888;">${escapeHtml(COMPANY.name)} &bull; ${escapeHtml(COMPANY.fullAddress)}</p>
            <p style="margin:0;font-size:12px;color:#888888;">${escapeHtml(COMPANY.phone)} &bull; <a href="${COMPANY.domain}" style="color:#1a73e8;text-decoration:none;">letsmoveit-right.com</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function link(href: string, text: string): string {
  return `<a href="${escapeHtml(href)}" style="color:#1a73e8;text-decoration:none;">${escapeHtml(text)}</a>`;
}

// ── Quote form (hero + get-free-quote page) ─────────────────────

export interface QuoteEmailData {
  name: string;
  email: string;
  phone: string;
  movingFrom: string;
  movingTo: string;
  moveSize: string;
  moveDate: string;
}

export function buildQuoteEmailHtml(d: QuoteEmailData): string {
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

  return shell("New Moving Quote Request", rows);
}

export function buildQuoteEmailSubject(name: string): string {
  return `New Moving Quote Request — ${name}`;
}

export function buildQuoteEmailText(d: QuoteEmailData): string {
  return [
    "New Moving Quote Request",
    "",
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Phone: ${d.phone}`,
    `Moving From: ${d.movingFrom}`,
    `Moving To: ${d.movingTo}`,
    `Move Size: ${d.moveSize}`,
    `Move Date: ${d.moveDate}`,
  ].join("\n");
}

// ── Contact form ────────────────────────────────────────────────

export interface ContactEmailData {
  inquiryType: string;
  typeLabel: string;
  name: string;
  email: string;
  phone: string;
  orderNumber?: string;
  message: string;
}

export function buildContactEmailHtml(d: ContactEmailData): string {
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

  return shell(`Contact Form — ${d.typeLabel}`, rows);
}

export function buildContactEmailSubject(typeLabel: string, name: string): string {
  return `[${typeLabel}] Contact Form — ${name}`;
}

export function buildContactEmailText(d: ContactEmailData): string {
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
  return lines.join("\n");
}
