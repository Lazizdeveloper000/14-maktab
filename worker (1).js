// Cloudflare Worker: Telegram tokenini yashirib, so'rovnoma javoblarini botga yuboradi.
// Token va chat ID bu yerda EMAS, Worker "Secrets" bo'limida saqlanadi.
// Sozlash: BOT_TOKEN, CHAT_ID (secret) va ALLOWED_ORIGIN (masalan https://sizning-sayt.uz)

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": allowed,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST") return new Response("Faqat POST", { status: 405, headers: cors });
    if (allowed !== "*" && origin !== allowed) return new Response("Ruxsat yo'q", { status: 403, headers: cors });

    let text = "";
    try { text = String((await req.json()).text || ""); } catch (e) {}
    if (!text.trim() || text.length > 4000) return new Response("Noto'g'ri so'rov", { status: 400, headers: cors });
    if (!text.startsWith("📝")) return new Response("Noto'g'ri format", { status: 400, headers: cors });

    const r = await fetch(`8954060795:AAFpcZDdl4zR90TgOhrah1Nfd6HFoz4FZQo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text }),
    });
    return new Response(r.ok ? "OK" : "Xato", { status: r.ok ? 200 : 502, headers: cors });
  },
};
