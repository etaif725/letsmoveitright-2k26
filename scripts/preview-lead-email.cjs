/**
 * Preview the lead confirmation email in a browser — no form submit, no Resend API.
 *
 * Usage:
 *   node scripts/preview-lead-email.cjs
 *   node scripts/preview-lead-email.cjs "Jane Doe"
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { buildLeadConfirmationEmail } = require("../lib/leadConfirmationEmail.cjs");

const mockName = process.argv[2] || "Jane Doe";
const { subject, html, text } = buildLeadConfirmationEmail({ name: mockName });

const outDir = path.join(__dirname, "..", ".preview");
const htmlPath = path.join(outDir, "lead-confirmation.html");
const textPath = path.join(outDir, "lead-confirmation.txt");

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(htmlPath, html, "utf8");
fs.writeFileSync(textPath, `Subject: ${subject}\n\n${text}`, "utf8");

console.log(`Subject: ${subject}`);
console.log(`HTML:  ${htmlPath}`);
console.log(`Text:  ${textPath}`);

const fileUrl = `file:///${htmlPath.replace(/\\/g, "/")}`;
try {
  if (process.platform === "win32") {
    execSync(`start "" "${htmlPath}"`, { stdio: "ignore", shell: true });
  } else if (process.platform === "darwin") {
    execSync(`open "${htmlPath}"`);
  } else {
    execSync(`xdg-open "${htmlPath}"`);
  }
  console.log("Opened in your default browser.");
} catch {
  console.log(`Open this file in a browser:\n  ${fileUrl}`);
}
