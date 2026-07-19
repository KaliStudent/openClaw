import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Bot,
  User,
  Send,
  Zap,
  CheckCircle,
  Clock,
  Sparkles,
  HelpCircle,
  HelpCircle as QuestionIcon,
  RefreshCw,
  ShoppingBag,
  Sliders,
  FileSpreadsheet,
} from "lucide-react";
import { Message, BusinessConfig, FAQItem, ShopperContext } from "./types";
import BusinessDashboard from "./components/BusinessDashboard";
import { FAQ_TEMPLATES } from "./utils/csv";

export default function App() {
  // Use the fashion aura preset as our elegant default
  const defaultPreset = FAQ_TEMPLATES.fashion;

  const [config, setConfig] = useState<BusinessConfig>({
    name: defaultPreset.name,
    industry: defaultPreset.industry,
    description: defaultPreset.description,
    tone: defaultPreset.tone,
    customInstructions: defaultPreset.customInstructions,
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(defaultPreset.faqs);

  const [shopper, setShopper] = useState<ShopperContext>({
    currentPage: "Minimalist Linen Coat",
    sizePref: "M",
    cart: [
      { id: "1", name: "Premium Wool Scarf", price: 45, quantity: 1 },
      { id: "2", name: "Organic Cotton Tee", price: 32, quantity: 2 },
    ],
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content: `Hello! Welcome to ${defaultPreset.name}. I'm your AI customer assistant. Feel free to ask me anything about our clothing sizing, shipping, sustainable manufacturing materials, or help checking out your active shopping cart!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [faqMatchCount, setFaqMatchCount] = useState<number>(0);
  const [tokenHint, setTokenHint] = useState<string>("Ready");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messaging list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle preset-load or manual resets of helper chat
  const handleResetChat = () => {
    setMessages([
      {
        id: "init",
        role: "assistant",
        content: `Hi! I am the automated customer representative for ${config.name}. How can I assist you today with our ${config.industry} website?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setLatency(null);
    setFaqMatchCount(0);
    setTokenHint("Ready");
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsgText = inputText;
    setInputText("");

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessagesList = [...messages, userMessage];
    setMessages(newMessagesList);
    setIsLoading(true);
    setTokenHint("Typing...");

    const startTime = performance.now();

    try {
      // Analyze client-side FAQ lookup count as reference hint
      const keywords = userMsgText.toLowerCase();
      const directMatches = faqs.filter(
        (faq) =>
          keywords.includes(faq.question.toLowerCase()) ||
          faq.question.toLowerCase().split(" ").some((w) => w.length > 3 && keywords.includes(w))
      );
      setFaqMatchCount(directMatches.length);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessagesList.map((m) => ({ role: m.role, content: m.content })),
          config,
          faqs,
          userContext: shopper,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to consult assistant backend endpoint.");
      }

      const data = await response.json();
      const endTime = performance.now();
      const elapsedSec = ((endTime - startTime) / 1000).toFixed(1);
      setLatency(parseFloat(elapsedSec));

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setTokenHint("Success");
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `⚠️ Error: ${err.message || "Unable to reach the Gemini model on this sandbox port. Please configure GEMINI_API_KEY inside the Secrets tab first!"}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setTokenHint("Failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-baked trigger questions to help the tester click & run instantly
  const getFaqSuggestions = () => {
    if (config.industry.includes("Clothing") || config.industry.includes("Apparel")) {
      return [
        "What is the dress sizing chart?",
        "Are your jackets tailored fit?",
        "How is my shipping calculated?",
        "Check my current simulated cart total",
      ];
    } else if (config.industry.includes("SaaS") || config.industry.includes("Software")) {
      return [
        "How do I install the API client?",
        "Is telemetry HIPAA compliant?",
        "What subscription levels do you offer?",
        "Show current package state",
      ];
    } else {
      return [
        "Do you offer gluten-free gnocchi pasta?",
        "What are your business hours?",
        "Do you take dinner bookings?",
        "Is delivery available further out?",
      ];
    }
  };

  return (
    <div className="w-full h-screen bg-[#0A0A0A] text-slate-100 flex overflow-hidden font-sans" id="app-workspace">
      {/* Sidebar - Builder Navigation */}
      <div className="w-64 border-r border-white/10 flex flex-col bg-[#0F0F0F] shrink-0" id="builder-sidebar">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/35">
            <Bot className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white block leading-none">OmniBot</span>
            <span className="text-[10px] text-indigo-400 font-mono">v3.5 Engine</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <div className="px-3 py-2.5 bg-white/5 rounded-lg text-indigo-400 font-medium flex items-center justify-between text-xs border border-white/5 shadow-sm">
            <span className="flex items-center gap-2.5">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-ping" />
              Sandbox Workspace
            </span>
            <span className="bg-indigo-900/40 text-[9px] px-1.5 py-0.5 rounded text-indigo-300 border border-indigo-700/30">Active</span>
          </div>

          <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Assistant Presets
          </div>

          <button
            onClick={() => {
              setConfig({
                name: "Aura Apparel",
                industry: "E-Commerce Clothing",
                description: "A sustainable luxury fashion brand specializing in urban minimalism and organic fabrics.",
                tone: "friendly",
                customInstructions: "Emphasize organic materials & eco-conscious practices. Politely offer sizing guides.",
              });
              setFaqs(FAQ_TEMPLATES.fashion.faqs);
              handleResetChat();
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center justify-between ${
              config.name === "Aura Apparel" ? "bg-white/5 text-white font-medium" : "text-slate-400 hover:bg-white/5"
            }`}
          >
            👗 Aura Apparel
          </button>

          <button
            onClick={() => {
              setConfig({
                name: "Synapse Analytics",
                industry: "B2B Software / SaaS",
                description: "An AI-powered dashboard offering stream metrics pipelines and live transaction monitoring.",
                tone: "professional",
                customInstructions: "Answer technically but accessibly. Highlight API integration docs and visual reports.",
              });
              setFaqs(FAQ_TEMPLATES.saas.faqs);
              handleResetChat();
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center justify-between ${
              config.name === "Synapse Analytics" ? "bg-white/5 text-white font-medium" : "text-slate-400 hover:bg-white/5"
            }`}
          >
            🛡️ Synapse Tech
          </button>

          <button
            onClick={() => {
              setConfig({
                name: "Basil Grove Bistro",
                industry: "Culinary & Dining",
                description: "A modern neighborhood bistro serving woodfired sourdough pizzas, fresh pasta, and farm-to-table salads.",
                tone: "casual",
                customInstructions: "Warm and inviting, sounding like a neighborhood local. Do not hesitate to describe our garlic sourdough crust.",
              });
              setFaqs(FAQ_TEMPLATES.restaurant.faqs);
              handleResetChat();
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center justify-between ${
              config.name === "Basil Grove Bistro" ? "bg-white/5 text-white font-medium" : "text-slate-400 hover:bg-white/5"
            }`}
          >
            🍕 Basil Grove Bistro
          </button>
        </nav>

        {/* System Info Footing */}
        <div className="p-4 mt-auto border-t border-white/5 bg-[#0C0C0C]">
          <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-3.5 space-y-1.5 text-xs text-indigo-300">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              <span>Platform Tier</span>
              <span className="text-emerald-400">PRO</span>
            </div>
            <p className="text-white font-medium text-[11px]">Server-side Gemini</p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: "92%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual-Column Content */}
      <div className="flex-1 flex flex-col min-w-0" id="workspace-layout">
        {/* Workspace Top Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0F0F0F] shrink-0" id="project-header">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-md shadow-indigo-500/50" />
              Bot Sandbox: {config.name} ({config.industry})
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              Tone: {config.tone}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetChat}
              className="text-xs px-3 py-1.5 border border-white/10 rounded-lg hover:bg-white/5 text-slate-350 transition flex items-center gap-1.5"
              id="header-restart-btn"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" /> Reset Interactive Test
            </button>
            <span className="text-xs text-indigo-400 px-3 py-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20 font-semibold font-mono">
              Live with Gemini-3.5-flash
            </span>
          </div>
        </header>

        {/* Dual Split */}
        <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden" id="workspace-grid">
          {/* Left Side: Setup Dashboard (7cols) */}
          <div className="col-span-7 bg-[#0D0D0D] flex flex-col overflow-hidden h-full border-r border-white/10" id="dashboard-col">
            <BusinessDashboard
              config={config}
              onChangeConfig={setConfig}
              faqs={faqs}
              onChangeFAQs={setFaqs}
              shopper={shopper}
              onChangeShopper={setShopper}
              onResetChat={handleResetChat}
            />
          </div>

          {/* Right Side: Chat Sandbox Simulator (5cols) */}
          <div className="col-span-5 bg-[#0F0F0F] flex flex-col h-full overflow-hidden" id="chat-preview-col">
            {/* Header Title with quick feedback badges */}
            <div className="p-4 border-b border-white/10 bg-[#0C0C0C] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider leading-none">Interactive Chatbot Sim</h3>
                  <p className="text-[10px] text-slate-400 mt-1">Simulates real checkout chat bubble interactions</p>
                </div>
              </div>

              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-red-500/80 rounded-full" />
                <span className="w-2 h-2 bg-yellow-500/80 rounded-full" />
                <span className="w-2 h-2 bg-green-500/80 rounded-full" />
              </div>
            </div>

            {/* Simulated Target Details bar */}
            <div className="px-4 py-2 bg-slate-950/80 border-b border-white/10 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="text-slate-500">🛒 Cart:</span>
                <span className="text-teal-400 font-medium truncate max-w-[130px]">
                  {shopper.cart.length} items (${shopper.cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)})
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-500">📏 Size:</span>
                <span className="text-slate-300 font-semibold">{shopper.sizePref}</span>
              </div>
              <span className="text-slate-400 text-[10px] bg-slate-900 border border-white/5 py-0.5 px-2 rounded truncate max-w-[140px]">
                Page: "{shopper.currentPage}"
              </span>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#111111]" id="chat-messages-container">
              {messages.map((m) => {
                const isAssistant = m.role === "assistant";
                return (
                  <div key={m.id} className={`flex gap-3 ${!isAssistant ? "justify-end" : "justify-start"}`}>
                    {isAssistant && (
                      <div className="w-8 h-8 rounded-full bg-indigo-650/80 text-indigo-200 border border-indigo-500/30 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div className="max-w-[82%] space-y-1">
                      <div className="flex items-center gap-2 px-1">
                        <span className="text-[10px] font-medium text-slate-400">
                          {isAssistant ? config.name : "Simulated Shopper"}
                        </span>
                        <span className="text-[9px] text-slate-505 font-mono text-slate-500">{m.timestamp}</span>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl text-[12.5px] leading-relaxed border ${
                          isAssistant
                            ? "bg-stone-900 border-white/15 text-slate-200 rounded-tl-sm shadow-sm"
                            : "bg-indigo-600 border-indigo-750 text-white rounded-tr-sm shadow-md"
                        }`}
                      >
                        {m.content.split("\n\n").map((para, i) => (
                          <p key={i} className="mb-2 last:mb-0">
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>

                    {!isAssistant && (
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-350 border border-slate-700 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-3 justify-start" id="chat-typing-indicator">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-8次 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-indigo-400 animate-spin" />
                  </div>
                  <div className="bg-slate-900 border border-white/5 p-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1.5 items-center justify-center h-4 py-1 px-2">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Smart Suggested questions panel */}
            <div className="px-4 py-2 border-t border-white/10 bg-[#0C0C0C] flex flex-col gap-1 shrink-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Suggested Test Scenarios
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pt-1 pr-1">
                {getFaqSuggestions().map((txt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputText(txt);
                    }}
                    className="text-[10.5px] px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 hover:border-white/20 rounded-full transition text-left truncate max-w-full"
                  >
                    💡 {txt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-slate-950 shrink-0" id="chat-input-form">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a query about shipping, sizing, pricing..."
                  className="flex-1 text-xs px-3.5 py-2.5 bg-[#161616] border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  id="message-input"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition shrink-0 ${
                    isLoading || !inputText.trim()
                      ? "bg-slate-800 text-slate-500"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/35"
                  }`}
                  id="send-message-btn"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Performance Analytics metrics */}
            <div className="p-4 border-t border-white/10 bg-[#0F0F0F] grid grid-cols-2 gap-3 shrink-0 text-xs">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 space-y-0.5">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Model Latency</p>
                <p className="text-sm font-mono text-white font-semibold">
                  {latency !== null ? `${latency}s` : "No requests yet"}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 space-y-0.5">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Knowledge Base Relevance</p>
                <p className="text-sm font-mono text-emerald-400 font-semibold">
                  {faqMatchCount > 0 ? `Matched FAQ context (${faqMatchCount})` : "Standard Reasoning"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
