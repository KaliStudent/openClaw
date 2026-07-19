import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Standard initialization of Gemini Client per gemini-api guidelines
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON
  app.use(express.json());

  // API endpoint for chatbot responses
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, config, faqs, userContext } = req.body;

      if (!ai) {
        return res.status(500).json({
          error: "API key is missing on the server. Please check the Secrets panel in AI Studio.",
        });
      }

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid 'messages' format." });
      }

      const botConfig = config || {
        name: "HelperBot",
        industry: "Retail",
        description: "A customer service assistant.",
        tone: "friendly",
        customInstructions: "",
      };

      // Extract details from current shopper context to build the prompt
      const contextStr = userContext
        ? `
Current Shopper Simulation State:
- Shopping Cart: ${JSON.stringify(userContext.cart || [])}
- Active Sizing Preference: ${userContext.sizePref || "Not specified"}
- Active Page: "${userContext.currentPage || "Product Details"}"
`
        : "";

      // Format knowledge database FAQs
      let faqsStr = "None loaded.";
      if (faqs && Array.isArray(faqs) && faqs.length > 0) {
        faqsStr = faqs
          .map(
            (faq, i) =>
              `FAQ #${i + 1}: [Category: ${faq.category || "General"}]\nQ: ${faq.question}\nA: ${faq.answer}`
          )
          .join("\n\n");
      }

      // Compose systematic rules & context for Gemini-3.5-flash
      const systemInstruction = `
You are "${botConfig.name}", a highly competent customer service chatbot for a website.
The website belongs to the business/brand detailed below. You must adapt your knowledge, capabilities, and answers to this type of business.

**BUSINESS INFORMATION:**
- Business Name: ${botConfig.name} Website / ${botConfig.industry} Store
- Industry/Niche: ${botConfig.industry}
- Description & Mission: ${botConfig.description}
- Desired Tone of Voice: ${botConfig.tone}

**KNOWLEDGE BASE & FAQ DIRECTIVE (FROM CSV / FILES):**
Here is our verified knowledge base. You should rely on this database as your source of truth for specific, factual store details:
---
${faqsStr}
---

${contextStr}

**BEHAVIOR & RESPONSIBILITIES:**
1. **FAQ Search priority**: When the user query relates directly to a topic in the FAQs above (e.g., shipping times, refunds, technical specifications, restaurant hours), you MUST base your response strictly on that answer. Keep it natural, conversational, and aligned with your Tone (${botConfig.tone}).
2. **Sales & General Queries**: Actively guide the customer. If they ask about buying, showcase the benefits of our business and help them feel welcome.
3. **Clothing Sizing & Tech specs**:
   - If this is a clothing brand and the FAQ doesn't have specific sizing, use standard size advice (S, M, L, XL, measurement guidelines) or ask them for their chest/waist to recommend a mock size.
   - If this is a tech product, explain in easy-to-understand terms.
4. **Interactive Shopping Cart & Checkouts**:
   - Answer shopping cart, payment, or payment process queries.
   - If they ask about checking their current cart status or mock ordering, refer politely to the "Current Shopper Simulation State" shown above.
5. **No Hallucinations**: Do not invent order tracking IDs, specific personal bank account details, or specific outside website URLs not mentioned in the FAQ. Offer to have a human support representative contact them if they provide an email or phone number.
6. **Polite Guardrails**: If asked about unrelated or abusive topics, or coding help outside of this customer service scenario, politely steer them back with: "I can only help you with questions regarding ${botConfig.name} and our services."

**Strict Output Constraint:** Run fully in character. Do not output metadata or system markers. Act as ${botConfig.name}.
`;

      // We form the content structure payload for @google/genai SDK
      // The API guidelines advise: "chats" or "models.generateContent" with config and systemInstruction
      // Let's use models.generateContent containing the chat history and the systemInstruction in the config block
      const contentParts = messages.map((m) => {
        return {
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        };
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contentParts,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text || "I apologize, but I received an empty response. How else can I assist you today?";

      res.json({ reply: text });
    } catch (err: any) {
      console.error("Error in /api/chat:", err);
      res.status(500).json({
        error: err.message || "An error occurred while generating a response from Gemini.",
      });
    }
  });

  // Serve Vite app based on standard developer guidelines
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Chatbot backend running on http://localhost:${PORT}`);
  });
}

startServer();
