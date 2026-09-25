const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const models = await ai.models.list();
  for (const model of models) {
    if (model.name.includes('flash')) console.log(model.name);
  }
}
run();
