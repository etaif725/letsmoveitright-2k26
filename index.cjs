require("dotenv").config();
const express = require("express");
const path = require("path");
const https = require("https");
const fs = require("fs");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { sendQuoteEmail, sendContactEmail, sendLeadConfirmationEmail } = require("./sendEmail.cjs");
const { isValidVisitorPhone, toE164 } = require("./lib/phoneShared.cjs");

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === "production";
const notificationEmails = (process.env.NOTIFICATIONS_EMAILS || "")
  .split(",")
  .filter(Boolean);

if (!notificationEmails.length) {
  console.warn(
    "NOTIFICATIONS_EMAILS is empty — quote/contact notification emails will not be sent.",
  );
}
if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not set — emails cannot be sent.");
}

// Trust the first proxy (AWS ALB / CloudFront / nginx) so rate
// limiting keys off the real visitor IP, not the load balancer.
app.set("trust proxy", 1);

// ─── Security middleware ────────────────────────────────────────

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
          "https://googleads.g.doubleclick.net",
          "https://maps.googleapis.com",
          "https://www.gstatic.com",
          "https://s.adroll.com",
          "https://d.adroll.com",
          "https://a.adroll.com",
        ],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
        connectSrc: [
          "'self'",
          "https://www.google-analytics.com",
          "https://www.googletagmanager.com",
          "https://maps.googleapis.com",
          "https://lead.hellomoving.com",
        ],
        frameSrc: ["https://www.googletagmanager.com"],
      },
    },
  }),
);

if (!isProd) {
  app.use(cors({ origin: "http://localhost:5173" }));
}

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ─── Rate limiting ──────────────────────────────────────────────
// Per-IP: 5 form submissions per 15-minute window. No real person
// needs to submit more than that — anything beyond is likely a bot.

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { error: "Too many submissions. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Helpers ────────────────────────────────────────────────────

function sanitize(str) {
  if (typeof str !== "string") return "";
  return str.replace(/[<>"'&]/g, (ch) => {
    const map = { "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "&": "&amp;" };
    return map[ch] || ch;
  });
}

function validateQuote(body) {
  const errors = [];
  const { name, email, phone, movingFrom, movingTo, moveDate, moveSize } = body || {};
  if (!name || typeof name !== "string" || name.trim().length < 2)
    errors.push("Name is required (min 2 characters)");
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push("A valid email is required");
  if (!phone || typeof phone !== "string" || !isValidVisitorPhone(phone))
    errors.push("A valid phone number is required");
  if (!movingFrom || typeof movingFrom !== "string" || movingFrom.trim().length < 2)
    errors.push("Moving from address is required");
  if (!movingTo || typeof movingTo !== "string" || movingTo.trim().length < 2)
    errors.push("Moving to address is required");
  if (!moveSize || typeof moveSize !== "string")
    errors.push("Move size is required");
  if (!moveDate || typeof moveDate !== "string")
    errors.push("Move date is required");
  return errors;
}

function validateContact(body) {
  const errors = [];
  const { name, email, phone, message } = body || {};
  if (!name || typeof name !== "string" || name.trim().length < 2)
    errors.push("Name is required (min 2 characters)");
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push("A valid email is required");
  if (!phone || typeof phone !== "string" || !isValidVisitorPhone(phone))
    errors.push("A valid phone number is required");
  if (!message || typeof message !== "string" || message.trim().length < 10)
    errors.push("Message is required (min 10 characters)");
  return errors;
}

// ─── API: Quote / Lead form ─────────────────────────────────────

app.post("/api/submit", submitLimiter, async (req, res) => {
  const errors = validateQuote(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  const { name, email, phone, movingFrom, movingTo, moveDate, moveSize } = req.body;
  const phoneNormalized = toE164(phone);

  const quoteData = {
    name,
    email,
    phone: phoneNormalized,
    movingFrom,
    movingTo,
    moveDate,
    moveSize,
  };

  sendQuoteEmail(quoteData, notificationEmails).catch((err) => {
    console.error("Error sending quote email:", err);
  });

  sendLeadConfirmationEmail(quoteData).catch((err) => {
    console.error("Error sending lead confirmation email:", err);
  });

  res.status(200).json({ message: "Form submitted successfully" });
});

// Backward compat: old /submit route
app.post("/submit", submitLimiter, (req, res, next) => {
  req.url = "/api/submit";
  next("route");
});

// ─── API: Contact form ──────────────────────────────────────────

app.post("/api/contact", submitLimiter, async (req, res) => {
  const errors = validateContact(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  const { inquiryType, typeLabel, name, email, phone, orderNumber, message } = req.body;
  const phoneNormalized = toE164(phone);

  sendContactEmail(
    {
      inquiryType,
      typeLabel,
      name,
      email,
      phone: phoneNormalized,
      orderNumber,
      message,
    },
    notificationEmails,
  ).catch((err) => {
    console.error("Error sending contact email:", err);
  });

  res.status(200).json({ message: "Message sent successfully" });
});

// ─── API: Proxy to Granot lead gateway ───────────────────────────
// The browser can't POST directly to lead.hellomoving.com (no CORS
// headers). This route proxies the request server-side.

const GRANOT_URL =
  "https://lead.hellomoving.com/LEADSGWHTTP.lidgw?&API_ID=ED9BFDA45A67&MOVERREF=leads@number1moving.com";

app.post("/api/submit-lead", submitLimiter, async (req, res) => {
  try {
    const response = await fetch(GRANOT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: req.body && typeof req.body === "object"
        ? new URLSearchParams(
            Object.entries(req.body).map(([k, v]) => [k, String(v)])
          ).toString()
        : "",
    });
    const text = await response.text();
    res.set("Content-Type", "text/plain");
    res.status(response.status).send(text);
  } catch (err) {
    console.error("Granot proxy error:", err);
    res.status(502).json({ error: "Failed to reach lead gateway" });
  }
});

// ─── Serve React build ──────────────────────────────────────────

const distPath = path.join(__dirname, "dist");

app.use(
  express.static(distPath, {
    maxAge: isProd ? "1y" : 0,
    etag: true,
    index: false,
  }),
);

// SPA catch-all — serve index.html with no-cache so the browser
// always gets the latest entry point (hashed assets are long-cached above).
app.get("*", (req, res) => {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.sendFile(path.join(distPath, "index.html"));
});

// ─── Global error handler ───────────────────────────────────────

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ─── Graceful shutdown ──────────────────────────────────────────

let server;

function shutdown(signal) {
  console.log(`\n${signal} received — shutting down gracefully`);
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
    setTimeout(() => {
      console.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// ─── Start server ───────────────────────────────────────────────

if (process.env.HTTPS === "true") {
  const certificate = fs.readFileSync(process.env.SSLCertificateFile, "utf8");
  const privateKey = fs.readFileSync(process.env.SSLCertificateKeyFile, "utf8");
  server = https.createServer({ key: privateKey, cert: certificate }, app);

  server.listen(PORT, () => {
    console.log(`Server running at https://localhost:${PORT}`);
  });

  server.on("error", (error) => {
    if (error.syscall !== "listen") throw error;
    const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;
    switch (error.code) {
      case "EACCES":
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });
} else {
  server = app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

  server.on("error", (error) => {
    if (error.syscall !== "listen") throw error;
    const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;
    switch (error.code) {
      case "EACCES":
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(`${bind} is already in use — stop the other process or set PORT to a different value`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });
}
