/**
 * Client-facing lead confirmation email — branded, simple prose (not internal table layout).
 */

const COMPANY = {
  name: "Let's Move It Right",
  tagline: "Full Service Moving Company",
  phone: "1-800-956-1118",
  imessagePhone: "+1-347-255-1482",
  imessagePhoneTel: "+13472551482",
  fullAddress: "503 Jessie Street, San Fernando, CA 91340",
  domain: "https://www.letsmoveit-right.com",
  logoUrl: "https://www.letsmoveit-right.com/images/logo-Lets-Move.png",
  fmcsaUrl: "https://www.fmcsa.dot.gov/protect-your-move",
};

const BRAND = {
  primary: "#f7c51e",
  primaryDark: "#e8b60f",
  heading: "#333333",
  body: "#555555",
  muted: "#888888",
  link: "#1fa7da",
  bg: "#f4f5f7",
};

function esc(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** "Jane Doe Smith" → "Jane" */
function firstName(fullName) {
  const trimmed = (fullName || "").trim();
  if (!trimmed) return "there";
  return trimmed.split(/\s+/)[0];
}

function buildLeadConfirmationEmail({ name }) {
  const leadFirstName = firstName(name);
  const subject = `Thank you for your inquiry — ${COMPANY.name}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};font-family:'Source Sans Pro',Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
          <tr>
            <td style="padding:32px 40px 24px;text-align:center;border-bottom:4px solid ${BRAND.primary};">
              <a href="${COMPANY.domain}" style="text-decoration:none;">
                <img src="${COMPANY.logoUrl}" alt="${esc(COMPANY.name)}" width="220" style="display:block;margin:0 auto;max-width:220px;height:auto;border:0;" />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px 8px;">
              <p style="margin:0 0 20px;font-size:17px;line-height:1.65;color:${BRAND.heading};font-family:Montserrat,Arial,Helvetica,sans-serif;font-weight:600;">
                Dear ${esc(leadFirstName)},
              </p>
              <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:${BRAND.body};">
                Thank you for your inquiry.
              </p>
              <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:${BRAND.body};">
                One of our moving experts will reach out shortly to verify your moving details, take an inventory list, or schedule a virtual walkthrough with you, at your convenience.
              </p>
              <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:${BRAND.body};">
                We are a fully licensed, bonded and insured carrier and local to your pickup (no brokers, no hidden fees).
              </p>
              <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:${BRAND.body};">
                Speaking of brokers, please see the official FMCSA (Federal Motor Carrier Safety Administration) website for all moving-related information, what to prepare for, and how to spot bad actors (in case you&rsquo;re shopping around for quotes).
              </p>
              <p style="margin:0 0 28px;font-size:16px;line-height:1.7;">
                <a href="${COMPANY.fmcsaUrl}" style="color:${BRAND.link};text-decoration:underline;font-weight:600;">${COMPANY.fmcsaUrl}</a>
              </p>
              <p style="margin:0 0 6px;font-size:16px;line-height:1.7;color:${BRAND.body};">
                Looking forward to speaking with you,
              </p>
              <p style="margin:0;font-size:16px;line-height:1.7;color:${BRAND.heading};font-weight:600;">
                The ${esc(COMPANY.name)} Team
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 40px 16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:24px 24px;background-color:#fff9e6;border-radius:6px;border-left:4px solid ${BRAND.primaryDark};text-align:center;">
                    <p style="margin:0 0 10px;font-size:16px;line-height:1.55;color:${BRAND.heading};font-weight:600;font-family:Montserrat,Arial,Helvetica,sans-serif;">
                      Busy at work? Rather text?
                    </p>
                    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${BRAND.body};">
                      We now support iMessage for free! Text this number and one of our moving specialists will reply back in a timely manner.
                    </p>
                    <a href="sms:${COMPANY.imessagePhoneTel}" style="display:inline-block;padding:12px 28px;background-color:${BRAND.primary};color:${BRAND.heading};font-size:16px;font-weight:700;text-decoration:none;border-radius:6px;font-family:Montserrat,Arial,Helvetica,sans-serif;">
                      Text ${esc(COMPANY.imessagePhone)}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:20px 24px;background-color:#fafafa;border-radius:6px;border-left:4px solid ${BRAND.primary};">
                    <p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:${BRAND.heading};font-weight:600;">
                      Questions? We&rsquo;re here to help.
                    </p>
                    <p style="margin:0;font-size:14px;line-height:1.5;color:${BRAND.muted};">
                      <a href="tel:${COMPANY.phone.replace(/[^0-9+]/g, "")}" style="color:${BRAND.link};text-decoration:none;font-weight:600;">${esc(COMPANY.phone)}</a>
                      &nbsp;&bull;&nbsp;
                      <a href="${COMPANY.domain}" style="color:${BRAND.link};text-decoration:none;">letsmoveit-right.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;background-color:${BRAND.heading};text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#cccccc;line-height:1.5;">
                ${esc(COMPANY.name)} &bull; ${esc(COMPANY.tagline)}
              </p>
              <p style="margin:0;font-size:12px;color:#999999;line-height:1.5;">
                ${esc(COMPANY.fullAddress)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `Dear ${leadFirstName},`,
    "",
    "Thank you for your inquiry.",
    "",
    "One of our moving experts will reach out shortly to verify your moving details, take an inventory list, or schedule a virtual walkthrough with you, at your convenience.",
    "",
    "We are a fully licensed, bonded and insured carrier and local to your pickup (no brokers, no hidden fees).",
    "",
    "Speaking of brokers, please see the official FMCSA (Federal Motor Carrier Safety Administration) website for all moving-related information, what to prepare for, and how to spot bad actors (in case you're shopping around for quotes).",
    "",
    COMPANY.fmcsaUrl,
    "",
    "Looking forward to speaking with you,",
    "",
    `The ${COMPANY.name} Team`,
    "",
    "Busy at work? Rather text?",
    "We now support iMessage for free! Text this number and one of our moving specialists will reply back in a timely manner.",
    COMPANY.imessagePhone,
    "",
    `${COMPANY.phone} | ${COMPANY.domain}`,
  ].join("\n");

  return { subject, html, text, leadFirstName };
}

module.exports = { buildLeadConfirmationEmail, firstName, COMPANY };
