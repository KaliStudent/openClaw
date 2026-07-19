import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

// Multi-provider LLM support
// Priority: Groq (cheapest) → OpenAI → Anthropic → Gemini
const PROVIDERS = {
  groq: {
    url: "https://api.groq.com/openai/v1/chat/completions",
    model: "llama-3.1-8b-instant",
    key: process.env.GROQ_API_KEY,
  },
  openai: {
    url: "https://api.openai.com/v1/chat/completions",
    model: "gpt-4o-mini",
    key: process.env.OPENAI_API_KEY,
  },
  anthropic: {
    url: "https://api.anthropic.com/v1/messages",
    model: "claude-3-5-haiku-20241022",
    key: process.env.ANTHROPIC_API_KEY,
  },
  gemini: {
    url: "https://generativelanguage.googleapis.com/v1beta/models",
    model: "gemini-2.0-flash",
    key: process.env.GEMINI_API_KEY,
  },
};

function getActiveProvider(): string {
  const forced = process.env.LLM_PROVIDER;
  if (forced && PROVIDERS[forced as keyof typeof PROVIDERS]?.key) return forced;
  
  // Auto-select first available
  for (const [name, config] of Object.entries(PROVIDERS)) {
    if (config.key) return name;
  }
  return "none";
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

async function callLLM(messages: ChatMessage[], systemPrompt: string): Promise<string> {
  const providerName = getActiveProvider();
  if (providerName === "none") {
    throw new Error("No LLM API key configured. Set GROQ_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, or GEMINI_API_KEY.");
  }

  const provider = PROVIDERS[providerName as keyof typeof PROVIDERS];

  if (providerName === "anthropic") {
    // Anthropic uses a different API format
    const response = await fetch(provider.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": provider.key!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: provider.model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((m) => ({
          role: m.role === "system" ? "user" : m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Anthropic error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || "I apologize, I received an empty response.";
  } else if (providerName === "gemini") {
    // Gemini uses its own format
    const url = `${provider.url}/${provider.model}:generateContent?key=${provider.key}`;
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { temperature: 0.7 },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, I received an empty response.";
  } else {
    // OpenAI-compatible (Groq and OpenAI both use this format)
    const allMessages = [{ role: "system" as const, content: systemPrompt }, ...messages];

    const response = await fetch(provider.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.key}`,
      },
      body: JSON.stringify({
        model: provider.model,
        messages: allMessages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`${providerName} error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I apologize, I received an empty response.";
  }
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000");

  app.use(express.json());

  // Health check / config endpoint
  app.get("/api/status", (req, res) => {
    const provider = getActiveProvider();
    res.json({
      status: "ok",
      provider: provider,
      model: provider !== "none" ? PROVIDERS[provider as keyof typeof PROVIDERS].model : null,
      configured: Object.entries(PROVIDERS)
        .filter(([_, c]) => c.key)
        .map(([name]) => name),
    });
  });

  // Main chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, config, faqs, businessContext, language } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid 'messages' format." });
      }

      const botConfig = config || {
        name: "Assistant",
        industry: "General",
        description: "A helpful business assistant.",
        tone: "friendly",
        customInstructions: "",
      };

      const lang = language || "en";
      const langInstruction = lang === "es"
        ? "IMPORTANT: Respond in Spanish (Español) unless the customer writes in English."
        : "Respond in English unless the customer writes in Spanish, then respond in Spanish.";

      // Build business context string
      let contextStr = "";
      if (businessContext) {
        const parts: string[] = [];
        if (businessContext.appointments) parts.push(`Upcoming appointments: ${JSON.stringify(businessContext.appointments)}`);
        if (businessContext.services) parts.push(`Services offered: ${JSON.stringify(businessContext.services)}`);
        if (businessContext.products) parts.push(`Products: ${JSON.stringify(businessContext.products)}`);
        if (businessContext.cart) parts.push(`Shopping cart: ${JSON.stringify(businessContext.cart)}`);
        if (businessContext.currentPage) parts.push(`Customer is viewing: "${businessContext.currentPage}"`);
        if (parts.length > 0) {
          contextStr = `\n\nCurrent Business Context:\n${parts.join("\n")}`;
        }
      }

      // Format FAQ knowledge base
      let faqsStr = "No specific knowledge base loaded.";
      if (faqs && Array.isArray(faqs) && faqs.length > 0) {
        faqsStr = faqs
          .map((faq: any, i: number) =>
            `FAQ #${i + 1}: [${faq.category || "General"}]\nQ: ${faq.question}\nA: ${faq.answer}`
          )
          .join("\n\n");
      }

      const systemPrompt = `You are "${botConfig.name}", a customer service chatbot for a small business.

BUSINESS INFORMATION:
- Business Name: ${botConfig.name}
- Industry: ${botConfig.industry}
- Description: ${botConfig.description}
- Tone: ${botConfig.tone}
${botConfig.customInstructions ? `- Special Instructions: ${botConfig.customInstructions}` : ""}

LANGUAGE: ${langInstruction}

KNOWLEDGE BASE:
${faqsStr}
${contextStr}

RULES:
1. When a query matches the knowledge base, use that as your source of truth.
2. Be helpful, concise, and match the configured tone.
3. Never invent specific data (order numbers, tracking IDs, account details).
4. If you cannot help, offer to connect them with a human representative.
5. Stay in character. Do not reveal you are an AI unless directly asked.
6. For appointment requests, confirm all details before booking.
7. Never provide unauthorized discounts or override business policies.`;

      const chatMessages: ChatMessage[] = messages.map((m: any) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      const reply = await callLLM(chatMessages, systemPrompt);
      const provider = getActiveProvider();

      res.json({
        reply,
        provider,
        model: PROVIDERS[provider as keyof typeof PROVIDERS]?.model || "unknown",
      });
    } catch (err: any) {
      console.error("Error in /api/chat:", err);
      res.status(500).json({
        error: err.message || "An error occurred while generating a response.",
      });
    }
  });

  // Serve Vite app in dev or static build in production
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
    console.log(`[MainStreet AI] Agent Builder running on http://localhost:${PORT}`);
    console.log(`[MainStreet AI] LLM Provider: ${getActiveProvider()}`);
  });
}

startServer();
