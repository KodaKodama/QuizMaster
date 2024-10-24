const { GoogleGenerativeAI } = require("@google/generative-ai");
const AI_API_KEY = process.env.AI_API_KEY;

const genAI = new GoogleGenerativeAI(AI_API_KEY);

// Function to generate quiz using Google Generative AI
async function generateQuiz(topic, difficulty) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      Create a quiz on the topic of "${topic}" with ${difficulty} difficulty.
      Each quiz question should be a multiple-choice question with four options, 
      and one correct answer. Return the quiz in the following JSON format:

      {
        "title": "Quiz on ${topic}",
        "questions": [
          {
            "question": "Question 1",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "answer": "Correct option"
          },
          {
            "question": "Question 2",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "answer": "Correct option"
          }
        ],
        "timeLimit": 10 // Set time limit in minutes depending on difficulty (easy: 10, medium: 15, hard: 20)
      }
    `;

    const result = await model.generateContent(prompt);
    const rawContent = await result.response.text();
    
    // Clean the response (remove code block or backticks if they exist)
    const cleanContent = rawContent.replace(/```json|```/g, '').trim();

    // Parse the cleaned content into JSON
    const quizData = JSON.parse(cleanContent);
    console.log(quizData);
    
    return quizData;

  } catch (error) {
    console.error("Error generating quiz:", error);
    return { error: "Failed to generate quiz" };
  }
}


module.exports = { generateQuiz };
