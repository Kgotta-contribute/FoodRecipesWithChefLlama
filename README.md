# 🦙 Chef Llama - AI Culinary Assistant

**Turn whatever ingredients you have in your kitchen into delicious, chemically accurate recipes!**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-3.5%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

[Live Repository](https://github.com/Kgotta-contribute/FoodRecipesWithChefLlama) · [Report Bug](https://github.com/Kgotta-contribute/FoodRecipesWithChefLlama/issues) · [Request Feature](https://github.com/Kgotta-contribute/FoodRecipesWithChefLlama/issues)

---

## 🌟 Overview

**Chef Llama** is an interactive, AI-driven recipe generation platform designed to minimize food waste and spark culinary creativity. By simply picking ingredients from an intuitive categorization board or typing them in, users receive tailored gourmet recipes with real-time portion scaling, detailed nutritional breakdowns, voice guidance, and safety guardrails against inedible inputs.

---

## ✨ Key Features

- 🔍 **Dynamic Ingredient Discovery Board**: 7 categories (*Popular, Vegetables, Dairy, Grains, Proteins, Spices, Fruits*) with instant emoji tags and interactive basket management.
- 🤖 **AI-Powered Cooking Engine**: Powered by Google AI Studio Gemini 3.5 Flash via LangChain for culinary chemistry and typo correction.
- 🛡️ **Inedible Item & Safety Guardrail**: Prevents hallucinated recipes when non-food items (e.g. *laptop, mobile, table, chair*) are provided, offering friendly, actionable feedback.
- 🔢 **Real-Time Dynamic Portion Scaling**: Seamlessly scale recipe ingredients for **2, 4, or 8 People** with instant unit conversion (metric grams, cups, spoons).
- 📊 **Macro & Micronutrient Estimation**: Automatically calculates calories, protein, carbs, and fat per serving based on exact ingredients.
- 🔄 **4 Creative Recipe Variations**: Provides 4 alternative recipe twists and substitution suggestions for every dish.
- 🎙️ **Hands-Free Web Speech TTS**: Step-by-step interactive voice guide with animated soundwave visualizer.
- 🖨️ **Print & Export Mode**: Clean, distraction-free 2-column print layout.
- 🌓 **Dark / Light Theme Toggle**: Persistent theme switcher tailored with warm terracotta kitchen accents.

---

## 🏗️ Architecture

```
[React 18 + Vite Frontend]
         │
         │  POST /api/generateRecipe
         ▼
[FastAPI Serverless Backend]
         │
         │  LangChain + Google GenAI
         ▼
[Google Gemini 3.5 Flash]
```

---

## 🚀 Tech Stack

### Frontend
- **React 18**
- **Vite 6**
- **Custom Kitchen Design System (Vanilla CSS)**
- **Web Speech API (SpeechSynthesis)**

### Backend & AI
- **Python 3.10+ / FastAPI**
- **LangChain Core & LangChain Google GenAI**
- **Google Gemini 3.5 Flash**
- **Pydantic & Uvicorn**

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Python**: `3.10` or higher
- **Google Gemini API Key**: Obtain from [Google AI Studio](https://aistudio.google.com/)

---

### Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Kgotta-contribute/FoodRecipesWithChefLlama.git
   cd FoodRecipesWithChefLlama
   ```

2. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

---

### Running Locally

1. **Start the FastAPI Backend** (Port 3005):
   ```bash
   python api/index.py
   ```

2. **Start the Vite Frontend** (Port 5173):
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to: `http://localhost:5173/`

---

## ☁️ Deployment on Vercel

This repository is pre-configured for seamless full-stack deployment on **Vercel** with a serverless Python backend:

1. **`vercel.json`** routes `/api/(.*)` requests directly to `api/index.py`.
2. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Deploy Chef Llama"
   git push origin main
   ```
3. Import the repository into **Vercel**.
4. In your Vercel Project Settings $\rightarrow$ **Environment Variables**, add:
   - `GEMINI_API_KEY`: `your_google_gemini_api_key`
5. Deploy! 🎉

---

## 📄 License

Distributed under the MIT License.

---

<div align="center">
  Crafted with ❤️ by <a href="https://github.com/Kgotta-contribute">Kgotta-contribute</a>
</div>
