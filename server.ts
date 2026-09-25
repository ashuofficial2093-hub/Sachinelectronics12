import express from "express";
import path from "path";
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient = null;
function getAI() {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing");
    }
    aiClient = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const systemInstruction = `You are a helpful, empathetic, and polite customer support executive for "Sachin Electricals & Repairs". 
Your tone should be extremely warm and understanding (e.g., use phrases like "चिंता मत कीजिए, हम आपका AC जल्द ठीक कर देंगे" when appropriate).
You must be able to converse dynamically in Hindi, Hinglish, and English based on the customer's input.
Your goal is to collect details to book a repair service.
You need to collect the following details step-by-step naturally:
1. Customer Name
2. Mobile / WhatsApp Number
3. Appliance type requiring repair (e.g., AC, Refrigerator, Washing Machine, Wiring, Cooler, Fan)
4. Description of the problem. After asking for the problem, politely ask the customer: "अगर आपके पास खराब सामान या मॉडल की फोटो है, तो कृपया अपलोड करें (यह ऐच्छिक/Optional है)।"
5. Address / Location for technician visit

Once you have gathered all these details, summarize them for the customer, confirm they are correct, and then call the "book_repair" function with the gathered data to finalize the booking.
Do not ask all questions at once, keep it a natural back and forth.`;

const bookRepairDeclaration: FunctionDeclaration = {
  name: "book_repair",
  description: "Book a repair service once all customer details have been collected.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Customer Name" },
      phone: { type: Type.STRING, description: "Mobile / WhatsApp Number" },
      product: { type: Type.STRING, description: "Appliance type requiring repair" },
      issue: { type: Type.STRING, description: "Description of the problem" },
      address: { type: Type.STRING, description: "Address / Location for technician visit" },
      issueImageUrl: { type: Type.STRING, description: "URL of the uploaded issue image (if any)" }
    },
    required: ["name", "phone", "product", "issue", "address"],
  },
};

app.post("/api/chat", async (req, res) => {
  try {
    const { history, message } = req.body;

    const chat = getAI().chats.create({
      model: "gemini-3.1-flash-lite",
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: [bookRepairDeclaration] }],
      },
      history: history.map((msg: any) => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }))
    });

    const response = await chat.sendMessage({ message });

    let responseText = response.text;
    let functionCallData = null;

    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      if (call.name === "book_repair") {
        functionCallData = call.args;
        responseText = "Thank you! Your booking details have been received and a job card has been created. Click the button below to send your confirmation via WhatsApp!";
      }
    }

    res.json({ text: responseText, bookingData: functionCallData });
  } catch (error) {
    console.error("Error in chat:", error);
    res.status(500).json({ error: "Failed to process chat message." });
  }
});

app.post("/api/assistant/dash", async (req, res) => {
  try {
    const { complaints, inventory } = req.body;

    const managerInstruction = `You are the MAIN AI ASSISTANT (Central Manager) for Sachin Electricals.
You oversee three specialized Sub-Agents:
1. Repair & Technician Agent (Manages complaints, technicians)
2. Product & Inventory Agent (Manages stock, products)
3. Billing & Payment Agent (Manages payments, UTRs)

The user has provided the current database state (Complaints and Inventory in JSON).
Your task is to act as the sub-agents, analyze the data, identify any issues (e.g., pending payments, low stock, unassigned or pending complaints), and generate a Daily Summary Update.
Format the output as a clean JSON object with the following structure:
{
  "repairAgent": { "status": "string", "issues": ["string"], "actionsTaken": ["string"] },
  "inventoryAgent": { "status": "string", "issues": ["string"], "actionsTaken": ["string"] },
  "billingAgent": { "status": "string", "issues": ["string"], "actionsTaken": ["string"] },
  "mainSummary": "string (Overall summary for the Admin)"
}`;

    const prompt = `Current Database State:\nComplaints: ${JSON.stringify(complaints).substring(0, 5000)}\nInventory: ${JSON.stringify(inventory).substring(0, 5000)}`;

    const response = await getAI().models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        systemInstruction: managerInstruction,
        responseMimeType: "application/json",
      }
    });

    const text = (response.text || "{}").replace(/^```json\n?/g, "").replace(/\n?```$/g, "").trim();
    res.json(JSON.parse(text));
  } catch (error) {
    console.error("Error generating dashboard:", error);
    res.status(500).json({ error: "Failed to generate AI dashboard." });
  }
});

app.post("/api/assistant/cmd", async (req, res) => {
  try {
    const { command, history, context } = req.body;

    const commandInstruction = `You are the MAIN AI ASSISTANT for Sachin Electricals.
You listen to Admin commands, delegate tasks to the specific Sub-Agent (Repair, Inventory, or Billing), and respond to the Admin.
You have the current context of complaints and inventory provided.
Always respond in a professional, concise, and helpful manner, indicating which sub-agent is handling the task.`;

    const chat = getAI().chats.create({
      model: "gemini-3.1-flash-lite",
      config: {
        systemInstruction: commandInstruction,
      },
      history: history.map((msg: any) => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }))
    });

    const fullCommand = `Context:\n${JSON.stringify(context).substring(0, 3000)}\n\nAdmin Command: ${command}`;
    const response = await chat.sendMessage({ message: fullCommand });

    res.json({ text: response.text });
  } catch (error) {
    console.error("Error processing AI command:", error);
    res.status(500).json({ error: "Failed to process AI command." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
