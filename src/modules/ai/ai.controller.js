const { askAgent, createChatSession, chatWithAgent } = require("./ai.service");

// In-memory sessions (use Redis for production)
const chatSessions = new Map();

const ask = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "message is required" });
    const reply = await askAgent(message);
    res.json({ reply });
  } catch (err) {
    console.error("AI ask error:", err);
    res.status(500).json({ error: "AI request failed" });
  }
};

const chat = async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || !message)
      return res.status(400).json({ error: "sessionId and message are required" });

    if (!chatSessions.has(sessionId)) {
      chatSessions.set(sessionId, createChatSession());
    }

    const session = chatSessions.get(sessionId);
    const reply = await chatWithAgent(session, message);
    res.json({ reply, sessionId });
  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({ error: "AI chat failed" });
  }
};

module.exports = { ask, chat };
