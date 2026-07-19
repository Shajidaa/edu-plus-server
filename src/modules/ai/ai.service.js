const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const SYSTEM_PROMPT = `You are EduPlus AI Assistant — a helpful assistant for the EduPlus tutoring platform.

You help users with:
- Finding tutors and tuition posts
- Understanding how to apply for tuitions
- Explaining platform features (student, tutor, admin roles)
- Payment and application process guidance
- General education-related questions

Platform info:
- Students can post tuition requests and pay tutors via Stripe
- Tutors can apply to tuition posts; students approve/reject applications
- Admins manage users and tuition listings
- Roles: student (default), tutor, admin

Keep responses concise, friendly, and helpful. If asked something unrelated to education or the platform, politely redirect.`;

const askAgent = async (userMessage) => {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
  });
  return response.choices[0].message.content;
};

const createChatSession = () => ({
  history: [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "assistant",
      content:
        "I'm EduPlus AI Assistant! I help students find tutors, guide tutors through applications, and answer any questions about the EduPlus platform. How can I help you today?",
    },
  ],
});

const chatWithAgent = async (chat, userMessage) => {
  chat.history.push({ role: "user", content: userMessage });
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: chat.history,
    max_tokens: 500,
    temperature: 0.7,
  });
  const reply = response.choices[0].message.content;
  chat.history.push({ role: "assistant", content: reply });
  return reply;
};

module.exports = { askAgent, createChatSession, chatWithAgent };
