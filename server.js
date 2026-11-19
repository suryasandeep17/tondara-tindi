
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "10mb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Tondara Tindi" });
});

// AI recipe handler
async function generateRecipe(req, res) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    if (!apiKey) {
      return res.status(500).json({
        error: "OpenAI API key is not configured."
      });
    }

    const { ingredients, preferences, prompt, craving, diet, cuisine, budget } = req.body;

    const userPrompt = prompt || `
Create a practical Indian recipe.

Available ingredients: ${
      Array.isArray(ingredients)
        ? ingredients.join(", ")
        : ingredients || "No ingredients specified"
    }

Craving: ${craving || "Any"}
Diet: ${diet || "Any"}
Cuisine: ${cuisine || "Any"}
Budget per meal: ${budget || "Not specified"}
Preferences: ${preferences || "None"}

Include:
- Recipe name
- Ingredients with quantities
- Preparation steps
- Cooking time
- Servings
- Tips
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are Tondara Tindi, an expert Indian home-cooking assistant. Specialize in practical Indian recipes, particularly Telugu, Andhra, Tamil, Karnataka and Kerala cuisine. Give clear, affordable recipes suitable for home kitchens."
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);

      return res.status(response.status).json({
        error: data.error?.message || "OpenAI request failed."
      });
    }

    const recipe = data.choices?.[0]?.message?.content || "";

    res.json({ recipe });
  } catch (error) {
    console.error("Recipe generation error:", error);

    res.status(500).json({
      error: "Failed to generate recipe."
    });
  }
}

// Support both frontend endpoint names
app.post("/api/chef", generateRecipe);
app.post("/api/generate-recipe", generateRecipe);

// Serve the production frontend
const distPath = path.join(__dirname, "dist");

app.use(express.static(distPath));

// React/Vite fallback
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API route not found" });
  }

  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) next(err);
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Internal server error"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Tondara Tindi running on port ${PORT}`);
});
