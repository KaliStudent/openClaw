import React, { useRef, useState } from "react";
import {
  Sliders,
  Sparkles,
  Upload,
  Download,
  Trash2,
  Plus,
  ShoppingCart,
  Layout,
  User,
  RefreshCw,
  FileSpreadsheet,
  AlertCircle,
  TrendingUp,
  HelpCircle,
} from "lucide-react";
import { BusinessConfig, FAQItem, ShopperContext, BusinessTone } from "../types";
import { FAQ_TEMPLATES, convertToCSV, parseCSV } from "../utils/csv";

interface BusinessDashboardProps {
  config: BusinessConfig;
  onChangeConfig: (newConfig: BusinessConfig) => void;
  faqs: FAQItem[];
  onChangeFAQs: (newFAQs: FAQItem[]) => void;
  shopper: ShopperContext;
  onChangeShopper: (newShopper: ShopperContext) => void;
  onResetChat: () => void;
}

export default function BusinessDashboard({
  config,
  onChangeConfig,
  faqs,
  onChangeFAQs,
  shopper,
  onChangeShopper,
  onResetChat,
}: BusinessDashboardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);

  // New FAQ Manual addition state
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [newC, setNewC] = useState("General");
  const [showAddForm, setShowAddForm] = useState(false);

  // Shopper simulation items manual add state
  const [cartItemName, setCartItemName] = useState("");
  const [cartItemPrice, setCartItemPrice] = useState("59.00");

  const loadPreset = (key: "fashion" | "saas" | "restaurant") => {
    const preset = FAQ_TEMPLATES[key];
    if (preset) {
      onChangeConfig({
        name: preset.name,
        industry: preset.industry,
        description: preset.description,
        tone: preset.tone,
        customInstructions: preset.customInstructions,
      });
      onChangeFAQs(preset.faqs);
      onResetChat();

      // Automatically sync some mock shopper items relevant to the industry preset
      if (key === "fashion") {
        onChangeShopper({
          currentPage: "Minimalist Linen Coat",
          sizePref: "M",
          cart: [
            { id: "1", name: "Premium Wool Scarf", price: 45, quantity: 1 },
            { id: "2", name: "Organic Cotton Tee", price: 32, quantity: 2 },
          ],
        });
      } else if (key === "saas") {
        onChangeShopper({
          currentPage: "Settings > API Keys",
          sizePref: "N/A",
          cart: [{ id: "3", name: "Grow Plan Subscription", price: 49, quantity: 1 }],
        });
      } else if (key === "restaurant") {
        onChangeShopper({
          currentPage: "Online Menu",
          sizePref: "N/A",
          cart: [
            { id: "4", name: "Woodfired Sourdough Pizza", price: 18, quantity: 2 },
            { id: "5", name: "Truffle Butter Pasta", price: 21, quantity: 1 },
          ],
        });
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setCsvError("Invalid file type. Please upload a standard CSV (.csv) file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          setCsvError("No valid rows matching FAQ structure were found. Please check columns: Question, Answer.");
        } else {
          onChangeFAQs(parsed);
          setCsvError(null);
          onResetChat();
        }
      } catch (err: any) {
        setCsvError("Failed to parse the CSV file. Please make sure the format is valid.");
      }
    };
    reader.readAsText(file);
  };

  const downloadCSVTemplate = () => {
    const csvContent = convertToCSV(faqs.length > 0 ? faqs : FAQ_TEMPLATES.fashion.faqs);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${config.name.toLowerCase().replace(/\s+/g, "_")}_faq_database.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addManualFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQ.trim() && newA.trim()) {
      onChangeFAQs([...faqs, { question: newQ.trim(), answer: newA.trim(), category: newC.trim() }]);
      setNewQ("");
      setNewA("");
      setNewC("General");
      setShowAddForm(false);
      onResetChat();
    }
  };

  const removeFAQ = (index: number) => {
    const updated = [...faqs];
    updated.splice(index, 1);
    onChangeFAQs(updated);
    onResetChat();
  };

  const handleConfigChange = (key: keyof BusinessConfig, val: string) => {
    onChangeConfig({
      ...config,
      [key]: val,
    });
  };

  // Shopper mutation helpers
  const handleShopperChange = (key: keyof ShopperContext, val: any) => {
    onChangeShopper({
      ...shopper,
      [key]: val,
    });
  };

  const addCartItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItemName.trim()) {
      const priceVal = parseFloat(cartItemPrice) || 10.0;
      const newItem = {
        id: Date.now().toString(),
        name: cartItemName.trim(),
        price: priceVal,
        quantity: 1,
      };
      handleShopperChange("cart", [...shopper.cart, newItem]);
      setCartItemName("");
    }
  };

  const removeCartItem = (id: string) => {
    handleShopperChange(
      "cart",
      shopper.cart.filter((item) => item.id !== id)
    );
  };

  const clearCart = () => {
    handleShopperChange("cart", []);
  };

  const totalCartValue = shopper.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden text-slate-100" id="business-dashboard-container">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight">Smart Bot Builder</h1>
            <p className="text-xs text-slate-400">Playground & Setup Console</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Template Sandbox
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8">
        {/* Industry Presets Quick Load */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Choose Industry Presets
            </label>
            <span className="text-[10px] text-slate-400">Auto-populates setup + knowledge base</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => loadPreset("fashion")}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                config.industry.includes("Clothing")
                  ? "bg-teal-500/15 border-teal-500/80 text-teal-300 shadow-sm"
                  : "bg-slate-850 border-slate-800 hover:border-slate-700 text-slate-300"
              }`}
              id="preset-fashion-btn"
            >
              <span className="block text-xs font-medium">Clothing / Retail</span>
              <span className="text-[10px] text-slate-400 truncate block mt-0.5">Aura Apparel</span>
            </button>
            <button
              onClick={() => loadPreset("saas")}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                config.industry.includes("SaaS") || config.industry.includes("Software")
                  ? "bg-teal-500/15 border-teal-500/80 text-teal-300 shadow-sm"
                  : "bg-slate-850 border-slate-800 hover:border-slate-700 text-slate-300"
              }`}
              id="preset-saas-btn"
            >
              <span className="block text-xs font-medium">Tech & SaaS</span>
              <span className="text-[10px] text-slate-400 truncate block mt-0.5">Synapse Tools</span>
            </button>
            <button
              onClick={() => loadPreset("restaurant")}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                config.industry.includes("Dining") || config.industry.includes("Culinary")
                  ? "bg-teal-500/15 border-teal-500/80 text-teal-300 shadow-sm"
                  : "bg-slate-850 border-slate-800 hover:border-slate-700 text-slate-300"
              }`}
              id="preset-dining-btn"
            >
              <span className="block text-xs font-medium">Restaurant / Food</span>
              <span className="text-[10px] text-slate-400 truncate block mt-0.5">Basil Grove Bistro</span>
            </button>
          </div>
        </section>

        {/* Brand identity configurations */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Layout className="w-3.5 h-3.5 text-teal-400" /> Brand & Assistant Profiles
          </h2>

          <div className="space-y-3 bg-slate-850 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Company / Bot Name</label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => handleConfigChange("name", e.target.value)}
                placeholder="e.g. Aura Apparel"
                className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                id="brand-name-input"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Business Niche / Industry</label>
              <input
                type="text"
                value={config.industry}
                onChange={(e) => handleConfigChange("industry", e.target.value)}
                placeholder="e.g. Eco-conscious fashion boutique"
                className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                id="brand-industry-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tone of Voice</label>
                <select
                  value={config.tone}
                  onChange={(e) => handleConfigChange("tone", e.target.value as BusinessTone)}
                  className="w-full text-xs px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
                  id="brand-tone-select"
                >
                  <option value="friendly">Friendly & Helpful</option>
                  <option value="professional">Professional & Technical</option>
                  <option value="casual">Casual & Relaxed</option>
                  <option value="enthusiastic">Energetic & Sparking</option>
                  <option value="direct">Concise & Direct</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={onResetChat}
                  className="w-full text-xs px-3 py-2 bg-slate-800 text-slate-300 border border-slate-750 rounded-lg hover:bg-slate-700 transition flex items-center justify-center gap-1.5"
                  id="reset-chat-btn"
                >
                  <RefreshCw className="w-3 h-3 text-slate-400" /> Reset Active Chat
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Business Description</label>
              <textarea
                value={config.description}
                onChange={(e) => handleConfigChange("description", e.target.value)}
                rows={3}
                placeholder="Describe your products, mission, key offerings..."
                className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
                id="brand-desc-textarea"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Custom Bot Guidelines (Optional)</label>
              <textarea
                value={config.customInstructions}
                onChange={(e) => handleConfigChange("customInstructions", e.target.value)}
                rows={2}
                placeholder="Specific instructions such as: 'Promote our spring sale code SPOTLIGHT' or 'Always request user order number before answering...'"
                className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
                id="brand-instructions-textarea"
              />
            </div>
          </div>
        </section>

        {/* Knowledge database upload / manage */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" /> Support Knowledge Base (CSV)
            </h2>
            <button
              onClick={downloadCSVTemplate}
              className="text-[10px] text-teal-400 hover:underline flex items-center gap-1 bg-teal-500/5 px-2 py-1 rounded"
              id="download-csv-btn"
            >
              <Download className="w-3 h-3" /> Download Template CSV
            </button>
          </div>

          {/* Drag & drop upload target */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
              dragActive
                ? "border-teal-500 bg-teal-500/10"
                : "border-slate-800 hover:border-slate-700 bg-slate-850/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" />
            <p className="text-xs font-medium text-slate-200">Drag & drop your custom CSV here</p>
            <p className="text-[10px] text-slate-400 mt-1">Accepts columns: Question, Answer, Category</p>
          </div>

          {csvError && (
            <div className="p-3 bg-red-950/40 border border-red-900 text-red-200 text-xs rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{csvError}</span>
            </div>
          )}

          {/* Current Loaded Database list */}
          <div className="bg-slate-850 rounded-xl border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-semibold text-slate-300 block">
                  Active Database ({faqs.length} FAQs loaded)
                </span>
                <span className="text-[10px] text-slate-400">Rerouted and matched by the AI instantly</span>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs font-medium bg-teal-600 hover:bg-teal-500 text-white px-2 py-1 rounded flex items-center gap-1 transition"
                id="show-add-faq-btn"
              >
                <Plus className="w-3.5 h-3.5" /> Add FAQ
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={addManualFAQ} className="mb-4 p-3 bg-slate-900 rounded-lg border border-slate-850 space-y-2.5">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-0.5 font-medium">Question</label>
                  <input
                    type="text"
                    required
                    value={newQ}
                    onChange={(e) => setNewQ(e.target.value)}
                    placeholder="e.g. What payment cards do you accept?"
                    className="w-full text-xs px-2 py-1.5 bg-slate-850 border border-slate-750 rounded text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-0.5 font-medium">Answer</label>
                  <textarea
                    required
                    rows={2}
                    value={newA}
                    onChange={(e) => setNewA(e.target.value)}
                    placeholder="e.g. We accept Visa, Mastercard, American Express, Apple Pay, and Google Pay."
                    className="w-full text-xs px-2 py-1.5 bg-slate-850 border border-slate-750 rounded text-slate-200 focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-0.5 font-medium">Category</label>
                  <input
                    type="text"
                    value={newC}
                    onChange={(e) => setNewC(e.target.value)}
                    placeholder="e.g. Payments"
                    className="w-full text-xs px-2 py-1.5 bg-slate-850 border border-slate-150 rounded text-slate-200 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-2.5 py-1 text-slate-400 hover:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-teal-650 hover:bg-teal-555 text-white bg-teal-600 rounded"
                    id="submit-faq-btn"
                  >
                    Save FAQ
                  </button>
                </div>
              </form>
            )}

            {faqs.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                No CSV or manual FAQs uploaded yet. The chatbot will rely on standard industry reasoning.
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-800 pr-1 text-xs">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="py-2.5 flex items-start justify-between gap-3 group">
                    <div className="space-y-0.5">
                      <span className="inline-block px-1.5 py-0.2 px-1 text-[8px] uppercase tracking-wider font-bold bg-slate-800 text-slate-300 rounded mb-1">
                        {faq.category || "General"}
                      </span>
                      <p className="font-medium text-slate-200 text-[11px]">{faq.question}</p>
                      <p className="text-slate-400 text-[10px] line-clamp-2">{faq.answer}</p>
                    </div>
                    <button
                      onClick={() => removeFAQ(idx)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete FAQ row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Shopper Simulation Panel */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShoppingCart className="w-3.5 h-3.5 text-teal-400" /> Active Shopper Workspace Simulator
            </h2>
            <p className="text-[10px] text-slate-500 mt-1">
              Simulate customer contexts so the chatbot responds with custom sizing/price details!
            </p>
          </div>

          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Viewing Target Page</label>
                <input
                  type="text"
                  value={shopper.currentPage}
                  onChange={(e) => handleShopperChange("currentPage", e.target.value)}
                  placeholder="e.g. Linen Trouser checkout"
                  className="w-full text-xs px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Sizing Measurement</label>
                <select
                  value={shopper.sizePref}
                  onChange={(e) => handleShopperChange("sizePref", e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                >
                  <option value="XS">XS (Chest ~32in)</option>
                  <option value="S">S (Chest 34-35in)</option>
                  <option value="M">M (Chest 36-37in)</option>
                  <option value="L">L (Chest 38-40in)</option>
                  <option value="XL">XL (Chest 41-43in)</option>
                  <option value="N/A">Not Applicable (e.g. SaaS/Food)</option>
                </select>
              </div>
            </div>

            {/* Shopping Cart Simulator */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">Customer Shopping Cart</label>
                {shopper.cart.length > 0 && (
                  <button onClick={clearCart} className="text-[10px] text-red-400 hover:underline">
                    Clear Cart
                  </button>
                )}
              </div>

              {shopper.cart.length === 0 ? (
                <p className="text-[10px] text-slate-500 py-2 bg-slate-900/50 text-center rounded border border-slate-800">
                  Cart is currently empty. Add products to test cart queries!
                </p>
              ) : (
                <div className="divide-y divide-slate-805 bg-slate-900 rounded-lg p-2 max-h-32 overflow-y-auto space-y-1">
                  {shopper.cart.map((item) => (
                    <div key={item.id} className="text-xs flex items-center justify-between py-1 text-slate-200">
                      <span className="truncate max-w-[140px] font-medium text-slate-300">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-mono text-[11px]">${item.price.toFixed(2)}</span>
                        <button
                          onClick={() => removeCartItem(item.id)}
                          className="text-slate-500 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-1.5 flex justify-between font-medium text-[11px] text-teal-400 border-t border-slate-800">
                    <span>Total Sim Price:</span>
                    <span className="font-mono">${totalCartValue.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Add Cart items form */}
              <form onSubmit={addCartItem} className="mt-2.5 flex gap-2">
                <input
                  type="text"
                  required
                  value={cartItemName}
                  onChange={(e) => setCartItemName(e.target.value)}
                  placeholder="Apparel or item name..."
                  className="flex-1 text-xs px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200"
                />
                <input
                  type="number"
                  required
                  step="0.01"
                  value={cartItemPrice}
                  onChange={(e) => setCartItemPrice(e.target.value)}
                  placeholder="Price"
                  className="w-14 text-xs px-1 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 text-center font-mono"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-slate-850 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded flex items-center justify-center transition shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
