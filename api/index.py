import os
import json
import re
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage

load_dotenv()

app = FastAPI()

# Configure CORS to allow access from the React development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to match your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Gemini API key from environment variables
gemini_key = os.getenv("GEMINI_API_KEY")
if not gemini_key:
    print("WARNING: GEMINI_API_KEY not found in environment variables.")

# Initialize LangChain ChatGoogleGenerativeAI targeting Gemini model
model = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash",
    google_api_key=gemini_key,
    temperature=0.7,
)

SYSTEM_PROMPT = """
You are a professional culinary assistant. You receive a list of ingredients and evaluate them.

CRITICAL INEDIBLE ITEM & SAFETY GUARDRAIL:
- First, inspect each item in the ingredients list.
- If the user provides any non-edible, non-food, household, digital, hardware, toxic, or hazardous items (e.g., "laptop", "mobile", "phone", "table", "chair", "computer", "plastic", "battery", "wood", "metal", "stone", "shoes", "clothes", "car", "soap", etc.), you MUST NOT invent a recipe with them or ignore them to make a random recipe.
- Instead, you MUST return a refusal JSON with "isEdible": false matching this schema:
{
  "isEdible": false,
  "invalidItems": ["String (list of all non-edible items detected, e.g. laptop, mobile)"],
  "message": "String (friendly explanation from Chef Llama, e.g. 'Chef Llama checked your pantry, but laptop, mobile, table, and chair are not edible food items! Please choose real culinary ingredients like tomatoes, cheese, flour, or chicken.')"
}

If ALL items are genuine culinary/food ingredients (or food typos that can be corrected):
Return a valid JSON object matching this exact schema:
{
  "isEdible": true,
  "recipeName": "String (the name of the recipe)",
  "description": "String (brief, appetizing description)",
  "prepTime": "String (e.g. 10 mins)",
  "cookTime": "String (e.g. 20 mins)",
  "servingsBase": 2,
  "ingredients": [
    {
      "name": "String (the ingredient name, e.g., cream cheese)",
      "amount": "String (the exact quantity and unit written naturally, e.g., '1/2 cup', '2 large', '250 grams', 'to taste'). CRITICAL: Do NOT use ounces or 'oz'. Use metric grams, ml, cups, pieces, or spoons."
    }
  ],
  "instructions": [
    "String (Step 1 detailed instructions)",
    "String (Step 2 detailed instructions)"
  ],
  "nutritionPerServing": {
    "calories": number (numeric value only in kcal, e.g. 380),
    "protein": number (numeric value only in grams, e.g. 14),
    "carbs": number (numeric value only in grams, e.g. 42),
    "fat": number (numeric value only in grams, e.g. 16)
  },
  "alternativeRecipes": [
    {
      "recipeName": "String (alternative recipe name, e.g., Chocolate Lotus Biscoff Cheesecake Bars)",
      "adjustments": "String (e.g., + Add 1 cup melted chocolate, - Replace 1 cup fresh cream)",
      "description": "String (2-3 lines explaining how to make this alternative dish with these adjustments)"
    }
  ]
}

You must return your response ONLY as a valid JSON object, with no other conversational text before or after it. Do not include markdown code block syntax (like ```json) in your response, just return the raw JSON string.

Additional Strict Rules for Nutrition Calculation:
- You must calculate the nutritional values strictly and conservatively by summing up the actual ingredients used in the recipe.
- If there are no high-protein sources (like meats, chicken, fish, eggs, tofu, or large amounts of beans/lentils/dairy) in the ingredients list, the protein total must reflect this (usually under 8-12g per serving).
- Realistic reference values: Bread is ~3g of protein per slice; Cheddar/Mozzarella cheese is ~3g of protein per 2 tbsp; Greek Yogurt is ~0.3g per tsp (very low); Vegetables (tomatoes, lettuce, onions) and herbs have virtually 0g of protein.
- Do not hallucinate or inflate numbers to fit generic lunch estimates. Be highly realistic.
- Always include exactly 4 distinct alternative recipes in the "alternativeRecipes" array, providing creative 2-3 line descriptions for each.

Culinary Chemistry & Typo Correction Rules:
1. **Fuzzy Typo Matching**: You must carefully check ingredients for spelling typos and correct them. For example: "lotus bicsoff" -> Lotus Biscoff cookies, "surar" -> sugar, "bbutter" -> butter, "blue berry" -> blueberries.
2. **Prioritize Unique Ingredients**: If the user has a premium or unique ingredient (like Lotus Biscoff, chocolate, fresh cream, cream cheese), design the recipe around it! Do not ignore them.
3. **Strict Kitchen Chemistry**: The recipe steps must be chemically valid and realistic for cooking. For example, a cake or muffin needs a binding batter (flour, liquid, fat, sugar, and eggs if available). A cheesecake needs a solid crust (like crushed cookies and butter) and a baked filling. Do not write steps that would result in raw flour or unmixed components.
"""

class RecipeRequest(BaseModel):
    ingredients: List[str]

def extract_and_parse_json(text: str) -> dict:
    cleaned = text.strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Fallback: try to extract JSON block using regex
        match = re.search(r"\{[\s\S]*\}", cleaned)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError as e:
                print("JSON extraction error:", e)
                raise HTTPException(status_code=500, detail="Failed to parse recipe JSON format.")
        print("Original text that failed parsing:", cleaned)
        raise HTTPException(status_code=500, detail="The AI response did not contain a valid recipe structure.")

@app.post("/api/generateRecipe")
async def generate_recipe(request: RecipeRequest):
    if not request.ingredients:
        raise HTTPException(status_code=400, detail="Ingredients list cannot be empty.")
    
    ingredients_str = ", ".join(request.ingredients)
    try:
        response = await model.ainvoke([
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=f"I have {ingredients_str}. Please give me a recipe suggestion!")
        ])
        
        raw_text = response.content
        if isinstance(raw_text, list):
            raw_text = "".join([part.get("text", "") if isinstance(part, dict) else str(part) for part in raw_text])
        elif not isinstance(raw_text, str):
            raw_text = str(raw_text)

        parsed_recipe = extract_and_parse_json(raw_text)
        return parsed_recipe
    except Exception as e:
        print("Recipe Generation Error:", str(e))
        raise HTTPException(status_code=500, detail=str(e) or "Failed to generate recipe from backend.")

if __name__ == "__main__":
    import uvicorn
    # Use reload=True for development hot-reloading
    uvicorn.run("index:app", host="0.0.0.0", port=3005, reload=True)
