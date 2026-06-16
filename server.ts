import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(express.json());

// Initialize Gemini Client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in the environment. AI features will fallback to dummy responses.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': "aistudio-build",
      }
    }
  });
};

// API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// API: run smart inventory optimization / AI insights using Gemini
app.post("/api/ai/optimize", async (req, res) => {
  try {
    const { items, currentTab, type } = req.body;
    const ai = getGeminiClient();

    let systemInstruction = "You are LuxeAnalytics Executive AI, a professional hospitality data scientist and strategic consultant for a five-star dining establish. Speak in a sharp, authoritative, premium, and sophisticated tone. Your recommendations should be concrete, high-impact, and extremely precise, focusing on fine dining raw ingredients like Wagyu, Truffles, Fresh Asparagus, Heavy Cream, and premium wine/beverages.";

    let prompt = "";
    if (type === "inventory") {
      prompt = `Review the following kitchen inventory status for our executive chef:
${JSON.stringify(items, null, 2)}

Provide a strategic optimization recommendation in 3 high-impact bullet points. Highlight:
1. Urgent logistics action on critical low stock items (e.g., Wagyu beef has 4.2kg left, Truffle oil has 1 unit left).
2. AI-powered demand forecasting (predicting a 15% increase in Meat and truffle-based dining due to upcoming luxury event/holiday weekend).
3. Exact storage temperature control or procurement advice for premium spirits.

Format your output in beautifully clean HTML (using <ul>, <li>, and tags like <strong> with standard Tailwind classes for dark mode: use slate/violet text colors appropriate to contrast against card backgrounds). Keep the total length brief (under 150 words). Do not use markdown tags like \`\`\`html in your response, just return pure HTML.`;
    } else {
      prompt = `Analyze our restaurant's financial metrics and profit report details:
${JSON.stringify(items, null, 2)}

Produce a brief strategic "AI Insight - Liquidity Forecast" (around 100-120 words). Focus on:
1. Projecting next quarter's net profit based on current Operational Expenses vs Budgeted amounts.
2. Recommendation to increase procurement for premium spirits and high-margin truffle products before seasonal price shifts.
3. Suggest an action item for menu price optimization.

Format your output in clean HTML (under 130 words). Do not wrap in markdown \`\`\`html backticks, return pure HTML suitable for rendering inside a premium dark theme dashboard.`;
    }

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const text = response.text || "Unable to retrieve AI analysis.";
      res.json({ success: true, advice: text });
    } else {
      // Fallback response with professional mock data matching the screenshot content
      console.log("No Gemini Client setup. Returning realistic fallback.");
      let fallbackText = "";
      if (type === "inventory") {
        fallbackText = `
          <ul class="space-y-3 text-sm text-slate-200">
            <li><strong>🚨 Critical Reorder:</strong> Procure <strong>Premium Wagyu Beef Grade A5</strong> immediately. Current stock (4.2 kg) is 83% below the safe Par Level.</li>
            <li><strong>📈 AI Demand Spike:</strong> Predictive modules project a <strong>15% surge in high-tier Meat demand</strong> for the upcoming holiday weekend. Increase truffle oil safety stock buffer.</li>
            <li><strong>🍷 Cellar Advisory:</strong> Lock in bulk pricing on estate-certified spirits to hedge against a projected 7.2% global luxury beverage tariff increase next month.</li>
          </ul>
        `;
      } else {
        fallbackText = `
          <div class="space-y-2 text-sm text-slate-200">
             <p class="leading-relaxed">Based on current monthly performance and inventory cycles, we project a <strong>12% increase in net profit</strong> for the next quarter.</p>
             <p class="leading-relaxed font-semibold text-violet-300">Recommendation: Increase procurement for premium spirits before seasonal price shifts and execute a 4.5% margin adjustment on top-tier menu items.</p>
          </div>
        `;
      }
      res.json({ success: true, advice: fallbackText });
    }
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Vite Setup
async function startServer() {
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
    console.log(`LuxeAnalytics full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
