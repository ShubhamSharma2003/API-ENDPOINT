// api/submit.js

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzQwuUsYfn_xD7e_nOWUueFFbn2KQOpWvlhW96rQ1rm0uoKDLbRKdZZ-0k9tG2FvaA1/exec";

// If you want to lock to a specific frontend domain, put it here.
// Otherwise "*" allows all origins.
const ALLOWED_ORIGIN = "*"; 
// e.g. "https://your-frontend.vercel.app"

export default async function handler(req, res) {
  // ---- CORS HEADERS (for every request) ----
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400"); // cache preflight for 1 day

  // ---- Handle preflight ----
//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }

//   // ---- Only allow POST ----
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed. Use POST." });
//   }

  try {
    const payload = req.body;

    const scriptResp = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow"
    });

    const contentType = scriptResp.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await scriptResp.json()
      : await scriptResp.text();

    // Send Apps Script response back to client
    return res.status(scriptResp.status).send(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({
      error: "Failed to reach Apps Script",
      details: err?.message ?? String(err),
    });
  }
}
