require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: "Hello",
    });
    console.log("Success 3.1 lite:");
    console.log(response.text);
  } catch(e) {
    console.log("Failed 3.1 lite:");
    console.log(e);
  }
}
run();
