/**
 * Vercel Node serverless functions often receive an unparsed request stream.
 * Read and parse JSON or urlencoded bodies when req.body is missing.
 */
export async function getRequestBody(req) {
  if (req.body != null && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    const keys = Object.keys(req.body);
    if (keys.length > 0) {
      return req.body;
    }
  }

  const raw = await readStream(req);
  if (!raw || !raw.trim()) {
    return {};
  }

  const contentType = (req.headers["content-type"] || "").toLowerCase();

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(raw);
    return Object.fromEntries(params.entries());
  }

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function readStream(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}
