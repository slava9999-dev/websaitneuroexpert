export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, contact, service, message } = req.body || {};
    if (!name || !contact || !service) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return res.status(500).json({ error: "Server not configured for Telegram" });
    }

    const text = `\u2728 Новая заявка NeuroExpert\n\n`+
      `\uD83D\uDC64 Имя: ${name}\n`+
      `\u260E\uFE0F Контакт: ${contact}\n`+
      `\uD83D\uDCBC Услуга: ${service}\n`+
      `\u270D\uFE0F Сообщение: ${message || '—'}`;

    const tgResp = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" })
    });

    const tgData = await tgResp.json();
    if (!tgResp.ok || !tgData || tgData.ok !== true) {
      return res.status(502).json({ error: "Failed to send Telegram notification", details: tgData });
    }

    return res.status(200).json({ success: true, message: "Спасибо! Мы свяжемся с вами в течение 15 минут" });
  } catch (err) {
    console.error("/api/contact error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
