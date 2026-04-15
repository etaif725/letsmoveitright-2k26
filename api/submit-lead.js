import { getRequestBody } from "./_parseBody.js";

const GRANOT_URL =
  "https://lead.hellomoving.com/LEADSGWHTTP.lidgw?&API_ID=ED9BFDA45A67&MOVERREF=leads@number1moving.com";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const parsed = await getRequestBody(req);
    const body =
      parsed && typeof parsed === "object" && Object.keys(parsed).length > 0
        ? new URLSearchParams(
            Object.entries(parsed).map(([k, v]) => [k, String(v)])
          ).toString()
        : "";

    const response = await fetch(GRANOT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const text = await response.text();
    res.setHeader("Content-Type", "text/plain");
    return res.status(response.status).send(text);
  } catch (err) {
    console.error("Granot proxy error:", err);
    return res.status(502).json({ error: "Failed to reach lead gateway" });
  }
}
