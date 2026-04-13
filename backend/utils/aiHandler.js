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
          content: `You are a technical recruiter. Return ONLY a JSON object with a 'questions' key. 
          Generate 15 EASY level MCQs for: ${topic}. 
          Keep questions very short (max 15 words) so they can be answered in 20 seconds.
          Format: { "questions": [ { "question": "text", "options": ["a", "b", "c", "d"], "correctAnswer": 0 } ] }`
        },
        {
          role: "user",
          content: `Generate 15 quick MCQs for ${topic}.`
        }
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    const data = JSON.parse(chatCompletion.choices[0].message.content);
    return data.questions;
  } catch (error) {
    console.error("AI Error:", error.message);
    return []; 
  }
};

module.exports = { generateQuestions };