// api/submit.js

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzQwuUsYfn_xD7e_nOWUueFFbn2KQOpWvlhW96rQ1rm0uoKDLbRKdZZ-0k9tG2FvaA1/exec";

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const payload = req.body; // expecting JSON body

    const scriptResp = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Try to return JSON if possible, otherwise text
    const contentType = scriptResp.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await scriptResp.json()
      : await scriptResp.text();

    return res.status(scriptResp.status).send(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({
      error: "Failed to reach Apps Script",
      details: err?.message ?? String(err),
    });
  }
}
