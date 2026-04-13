const { Groq } = require('groq-sdk');

const generateQuestions = async (topic) => {
  try {
    // Initialize groq INSIDE the function so it has access to the API key
    const groq = new Groq({ 
      apiKey: process.env.GROQ_API_KEY
    });
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Generate 15 technical MCQs about ${topic}. Return ONLY JSON: {"questions": [{"question": "...", "options": ["a", "b", "c", "d"], "correctAnswer": 0}]}`
        }
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) return null;

    const data = JSON.parse(content);
    return data.questions || null;
  } catch (error) {
    console.error("AI Generation Error:", error.message);
    return null; 
  }
};

module.exports = { generateQuestions };