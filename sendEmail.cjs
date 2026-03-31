const nodemailer = require("nodemailer");
// Set this from config or environment variable.
const PASSWORD = process.env.EMAIL_PASSWORD || "password";
const USER = process.env.EMAIL_USER || "";

async function send365Email({ to, subject, html, text }) {
  try {
    const transportOptions = {
      host: "mail.omnis.com",
      port: "587",
      auth: { user: USER, pass: PASSWORD },
      secureConnection: true,
      tls: { ciphers: "SSLv3" },
    };

    const mailTransport = nodemailer.createTransport(transportOptions);

    await mailTransport.sendMail({
      from: USER,
      to,
      replyTo: USER,
      subject,
      html,
      text,
    });
  } catch (err) {
    console.error(`send365Email: An error occurred:`, err);
    throw err;
  }
}

module.exports = send365Email;
