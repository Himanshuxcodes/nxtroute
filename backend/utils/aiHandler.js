const generateQuestions = async (topic) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a Senior Software Engineer. Generate 15 EASY level technical coding MCQs about ${topic}.
          
          STRICT RULES:
          1. Focus ONLY on syntax, logic, functions, and data structures.
          2. No soft skills or "recruiter" questions.
          3. Use small code snippets in the 'question' string whenever possible (use \n for line breaks).
          4. Return ONLY a valid JSON object.
          
          Format: { "questions": [ { "question": "What is the output of: \n console.log(typeof []);", "options": ["object", "array", "null", "undefined"], "correctAnswer": 0 } ] }`
        }
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    const data = JSON.parse(chatCompletion.choices[0].message.content);
    return data.questions || null;
  } catch (error) {
    console.error("AI Error:", error);
    return null;
  }
};