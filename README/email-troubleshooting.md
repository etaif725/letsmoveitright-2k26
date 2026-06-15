# Lead emails (Resend)

Quote forms POST to `/api/submit`. On **Vercel**, that is handled by `api/submit.js`. On a **Node server** (PM2 + `index.cjs`), the same path is handled by Express and `sendEmail.cjs`.

Each successful quote submission sends **two** emails:

1. **Internal notification** — to `NOTIFICATIONS_EMAILS` (existing table-style email).
2. **Lead confirmation** — to the customer who submitted the form (branded client-facing email from `lib/leadConfirmationEmail.cjs`).

## Checklist

1. **`RESEND_API_KEY`** — Set in Vercel → Project → Settings → Environment Variables (Production). Redeploy after changing.

2. **`FROM_EMAIL`** — Must be a sender Resend allows (verified domain or `onboarding@resend.dev` for testing).

3. **`NOTIFICATIONS_EMAILS`** — Comma-separated list of recipients. If this is empty, the API returns **500** and no email is sent.

4. **Vercel function logs** — Deploy → Functions → select `/api/submit` → View logs. Look for `Resend error:` or `NOTIFICATIONS_EMAILS is empty`.

5. **Browser console** — After a quote submit, if the notification fails, you should see:  
   `Email notification failed: <status> ...` with the server message.

## Common failures

| Symptom | Likely cause |
|--------|----------------|
| 500 "No notification recipients" | `NOTIFICATIONS_EMAILS` not set in Vercel |
| 500 "Email service not configured" | `RESEND_API_KEY` missing |
| 500 "Email send failed" + Resend detail | Invalid `from` domain, bad API key, or Resend account issue |
| 400 validation errors | Request body not parsed — fixed by `api/_parseBody.js` on Vercel |

## Domain verification (Resend)

Production `FROM_EMAIL` must use a domain you verified in the Resend dashboard (DNS records).
