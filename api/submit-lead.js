const GRANOT_URL =
  "https://lead.hellomoving.com/LEADSGWHTTP.lidgw?&API_ID=ED9BFDA45A67&MOVERREF=leads@number1moving.com";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body && typeof req.body === "object"
      ? new URLSearchParams(
          Object.entries(req.body).map(([k, v]) => [k, String(v)])
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
