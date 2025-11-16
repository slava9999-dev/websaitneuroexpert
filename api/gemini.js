export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  // Validate API key
  if (!process.env.GOOGLE_API_KEY) {
    return res.status(500).json({ error: "Google API key not configured" });
  }

  try {
    // v1beta поддерживает эти модели:
    // gemini-1.5-flash  |  gemini-1.5-pro
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
      process.env.GOOGLE_API_KEY;

    const prompt =
      req.body?.prompt ||
      "Привет! Я AI‑консультант NeuroExpert на базе Google Gemini. Чем могу помочь?";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("AI API error:", error);
    return res.status(500).json({ error: "Failed to get AI response" });
  }
}
