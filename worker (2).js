const BOT_TOKEN = "8954060795:AAFpcZDdl4zR90TgOhrah1Nfd6HFoz4FZQo";
const CHAT_IDS = [
  "8990585770",
];
const ALLOWED_ORIGIN = "*";

export default {
  async fetch(req) {
    const origin = req.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST") return new Response("Worker ishlayapti", { headers: cors });
    if (ALLOWED_ORIGIN !== "*" && origin !== ALLOWED_ORIGIN) return new Response("Ruxsat yo'q", { status: 403, headers: cors });

    let text = "";
    try { text = String((await req.json()).text || ""); } catch (e) {}
    if (!text.trim() || text.length > 4000) return new Response("Noto'g'ri so'rov", { status: 400, headers: cors });
    if (!text.startsWith("📝") && !text.startsWith("💬")) return new Response("Noto'g'ri format", { status: 400, headers: cors });

    const results = await Promise.all(CHAT_IDS.map(id =>
      fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: id, text }),
      }).then(r => r.ok).catch(() => false)
    ));
    const ok = results.some(Boolean);
    return new Response(ok ? "OK" : "Xato", { status: ok ? 200 : 502, headers: cors });
  },
};