export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export type BusinessTone = "friendly" | "professional" | "casual" | "enthusiastic" | "direct";

export interface BusinessConfig {
  name: string;
  industry: string;
  description: string;
  tone: BusinessTone;
  customInstructions: string;
  language: "en" | "es" | "auto";
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration?: string;
  description?: string;
}

export interface AppointmentSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

export interface BusinessContext {
  services: ServiceItem[];
  currentPage: string;
  appointments?: AppointmentSlot[];
  cart?: CartItem[];
  customFields?: Record<string, string>;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export type AgentTier = "core" | "standard" | "premium";

export interface AgentOption {
  id: string;
  name: string;
  description: string;
  tier: AgentTier;
  icon: string;
}

export const AVAILABLE_AGENTS: AgentOption[] = [
  // Core tier
  { id: "basic-chatbot", name: "Basic Chatbot", description: "Entry-level bilingual chatbot", tier: "core", icon: "💬" },
  { id: "customer-service", name: "Customer Service", description: "Product inquiries & support", tier: "core", icon: "🎧" },
  { id: "knowledgebase", name: "Knowledge Base", description: "Tiered info access control", tier: "core", icon: "📚" },
  { id: "appointment-scheduler", name: "Appointment Scheduler", description: "Booking & calendar management", tier: "core", icon: "📅" },
  // Standard tier
  { id: "lead-qualifier", name: "Lead Qualifier", description: "Score & route leads", tier: "standard", icon: "🎯" },
  { id: "client-onboarding", name: "Client Onboarding", description: "New client setup flow", tier: "standard", icon: "🤝" },
  { id: "meeting-prep", name: "Meeting Prep", description: "Research & agenda generation", tier: "standard", icon: "📋" },
  { id: "email-meeting-summary", name: "Email & Meetings", description: "Summarize & extract actions", tier: "standard", icon: "📧" },
  { id: "basic-secretary", name: "Basic Secretary", description: "Admin support & filing", tier: "standard", icon: "🗂️" },
  { id: "daily-briefing", name: "Daily Briefing", description: "Morning & EOD summaries", tier: "standard", icon: "☀️" },
  // Premium tier
  { id: "executive-assistant", name: "Executive Assistant", description: "Full chief-of-staff capabilities", tier: "premium", icon: "👔" },
  { id: "financial-manager", name: "Financial Manager", description: "Books, invoices, AR/AP", tier: "premium", icon: "💰" },
  { id: "content-creator", name: "Content Creator", description: "Social, blogs, campaigns", tier: "premium", icon: "✍️" },
  { id: "sales-outreach", name: "Sales Outreach", description: "Cold outreach & follow-ups", tier: "premium", icon: "📞" },
  { id: "competitive-intel", name: "Competitive Intel", description: "Market research & battlecards", tier: "premium", icon: "🔍" },
];

export interface IndustryPreset {
  name: string;
  industry: string;
  description: string;
  tone: BusinessTone;
  customInstructions: string;
  language: "en" | "es" | "auto";
  faqs: FAQItem[];
  services: ServiceItem[];
  suggestedAgents: string[];
}
