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
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ShopperContext {
  cart: CartItem[];
  sizePref: string;
  currentPage: string;
}
