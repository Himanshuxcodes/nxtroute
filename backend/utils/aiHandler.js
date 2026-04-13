const OpenAI = require("openai");
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const generateQuestions = async (topic) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Generate 15 EASY MCQs for: ${topic}. Return ONLY JSON: {"questions": [{"question": "...", "options": ["a", "b", "c", "d"], "correctAnswer": 0}]}`
        }
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    const data = JSON.parse(chatCompletion.choices[0].message.content);
    // Ensure it's exactly 15 or at least has data
    return data.questions && data.questions.length > 0 ? data.questions : null;
  } catch (error) {
    console.error("GROQ_ERROR:", error.message);
    return null;
  }
};

module.exports = { generateQuestions };