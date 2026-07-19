import { FAQItem } from "../types";

/**
 * Parses double-quoted CSV records safely.
 */
export function parseCSV(text: string): FAQItem[] {
  const lines: string[] = [];
  let currentLine = "";
  let insideQuotes = false;

  // Split lines while preserving newlines within double quotes
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
      currentLine += char;
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = "";
      if (char === "\r" && text[i + 1] === "\n") {
        i++; // skip trailing LF
      }
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  if (lines.length < 2) return [];

  // Parse headers
  const headers = parseCSVRow(lines[0]).map((h) => h.trim().toLowerCase());

  let qIdx = headers.findIndex(
    (h) => h.includes("question") || h.includes("q") || h === "prompt" || h === "query"
  );
  let aIdx = headers.findIndex(
    (h) => h.includes("answer") || h.includes("a") || h === "response" || h === "reply" || h.includes("resolution")
  );
  let cIdx = headers.findIndex(
    (h) => h.includes("category") || h.includes("type") || h.includes("topic") || h.includes("tag")
  );

  // Fallbacks if target keywords are missing
  if (qIdx === -1) qIdx = 0;
  if (aIdx === -1) aIdx = headers.length > 1 ? 1 : 0;
  if (cIdx === -1) cIdx = headers.length > 2 ? 2 : -1;

  const items: FAQItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rowValues = parseCSVRow(lines[i]);
    if (rowValues.length === 0) continue;

    const question = rowValues[qIdx] || "";
    const answer = rowValues[aIdx] || "";
    const category = cIdx !== -1 && rowValues[cIdx] ? rowValues[cIdx] : "General";

    if (question.trim() && answer.trim()) {
      items.push({
        question: question.trim(),
        answer: answer.trim(),
        category: category.trim(),
      });
    }
  }

  return items;
}

function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++; // Skip inner escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// Format items back to a CSV string for user download reference
export function convertToCSV(items: FAQItem[]): string {
  const header = "Question,Answer,Category\n";
  const rows = items
    .map((item) => {
      const q = `"${item.question.replace(/"/g, '""')}"`;
      const a = `"${item.answer.replace(/"/g, '""')}"`;
      const c = `"${item.category.replace(/"/g, '""')}"`;
      return `${q},${a},${c}`;
    })
    .join("\n");
  return header + rows;
}

// Bundled templates for immediate high-density playground setups
export const FAQ_TEMPLATES: Record<
  string,
  {
    name: string;
    industry: string;
    description: string;
    tone: "friendly" | "professional" | "casual" | "enthusiastic" | "direct";
    customInstructions: string;
    faqs: FAQItem[];
  }
> = {
  fashion: {
    name: "Aura Apparel",
    industry: "E-Commerce Clothing",
    description: "A sustainable luxury fashion brand specializing in urban minimalism and organic fabrics.",
    tone: "friendly",
    customInstructions: "Emphasize organic materials & eco-conscious practices. Politely offer sizing guides.",
    faqs: [
      {
        question: "What is your return and sizing exchange policy?",
        answer: "We offer free 30-day returns and size exchanges on all unworn garments with original designer tags attached. Simply print a prepaid shipping label from your user portal.",
        category: "Refunds & Returns",
      },
      {
        question: "Do you have a sizing chart for dresses and outerwear?",
        answer: "Yes! Our dresses and outerwear follow natural European shapes: XS (US 2, Chest 32in), S (US 4-6, Chest 34-35in), M (US 8-10, Chest 36-37in), L (US 12-14, Chest 38-40in), and XL (US 16, Chest 41-43in). If you are between sizes, we recommend sizing up for winter outerwear.",
        category: "Clothing Sizing",
      },
      {
        question: "How long does shipping take?",
        answer: "Standard shipping takes 3-5 business days. Express shipping is delivered in 1-2 business days. Shipping is fully carbon-offset!",
        category: "Shipping",
      },
      {
        question: "How should I wash my organic cotton items?",
        answer: "Wash cold on a delicate cycle with sustainable mild detergent. Lay flat or hang dry to preserve fabric density and save energy.",
        category: "Garment Care",
      },
      {
        question: "Where do you manufacture your apparel?",
        answer: "Our sewing partners are fair-trade certified certified facilities based in Portugal and Japan, adhering to fair wages and safe environments.",
        category: "Sustainability",
      },
    ],
  },
  saas: {
    name: "Synapse Analytics",
    industry: "B2B Software / SaaS",
    description: "An AI-powered dashboard offering stream metrics pipelines and live transaction monitoring.",
    tone: "professional",
    customInstructions: "Answer technically but accessibly. Highlight API integration docs and visual reports.",
    faqs: [
      {
        question: "How do I integrate the API into my web application?",
        answer: "Install our NPM package: '@synapse/analytics-sdk'. Initialize with your public environment client token. Detailed examples for React, Vue, Next.js, and Node are in our developer dashboard docs under API Keys.",
        category: "Technical Setup",
      },
      {
        question: "What are your pricing plans?",
        answer: "We offer Spark (Free up to 10k events/mo), Grow ($49/mo up to 500k events/mo), and Enterprise (custom pricing, SOC2 certification, and dedicated database clusters). Plans can be raised or lowered at any time.",
        category: "Billing & Plans",
      },
      {
        question: "Is your telemetry HIPAA or GDPR compliant?",
        answer: "Yes, Synapse is fully GDPR compliant. Data is encrypted in transit via TLS 1.3 and at rest using AES-256. For HIPAA business agreements, please contact enterprise@synapse.io.",
        category: "Security",
      },
      {
        question: "How does the active alert system notify us?",
        answer: "Alerting pipelines can push directly to Slack, generic Webhook endpoints, SMS alerts, or PagerDuty. Set custom threshold limits in Settings > Channels.",
        category: "Features",
      },
    ],
  },
  restaurant: {
    name: "Basil Grove Bistro",
    industry: "Culinary & Dining",
    description: "A modern neighborhood bistro serving woodfired sourdough pizzas, fresh pasta, and farm-to-table salads.",
    tone: "casual",
    customInstructions: "Warm and inviting, sounding like a neighborhood local. Do not hesitate to describe our garlic sourdough crust.",
    faqs: [
      {
        question: "Do you have gluten-free options?",
        answer: "Absolutely! We customize any of our pastas with housemade gluten-free potato gnocchi. You can also swap any regular pizza to a crispy gluten-free cauliflower base for +$3.",
        category: "Menu Guidelines",
      },
      {
        question: "What are your hours of operation?",
        answer: "We are open Wednesday to Sunday: Lunch from 11:30 AM - 2:30 PM, and Dinner from 5:00 PM - 10:00 PM. We are closed Mondays and Tuesdays.",
        category: "General Hours",
      },
      {
        question: "Do you take lunch reservations?",
        answer: "Reservations are open on OpenTable for dinner slots. For lunch, we operate strictly on a walk-in, first-come-first-served basis.",
        category: "Reservations",
      },
      {
        question: "Will you deliver outside the city center?",
        answer: "We deliver directly up to a 6-mile radius via our staff to keep pizza hot. Beyond that, find us on UberEats and DoorDash for custom ranges.",
        category: "Delivery",
      },
    ],
  },
};
