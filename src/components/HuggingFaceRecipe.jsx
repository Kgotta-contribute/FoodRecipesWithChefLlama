import { useState, useEffect, useRef } from 'react'

export default function HuggingFaceRecipe({ recipe, onSaveFavorite }) {
    const [servings, setServings] = useState(2);
    const [completedSteps, setCompletedSteps] = useState({});
    const [speakingIndex, setSpeakingIndex] = useState(null);

    const multiplier = servings / (recipe.servingsBase || 2);
    
    // Store user-selected portions to restore after printing
    const activeServingsRef = useRef(2);

    // Cancel speech and manage print event listeners
    useEffect(() => {
        const handleBeforePrint = () => {
            setServings(2);
        };

        const handleAfterPrint = () => {
            setServings(activeServingsRef.current);
        };

        window.addEventListener('beforeprint', handleBeforePrint);
        window.addEventListener('afterprint', handleAfterPrint);

        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
            window.removeEventListener('beforeprint', handleBeforePrint);
            window.removeEventListener('afterprint', handleAfterPrint);
        };
    }, []);

    const toggleStep = (index) => {
        setCompletedSteps(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const speakStep = (text, index, e) => {
        e.stopPropagation(); // Stop click from toggling step checkmarks

        if (!window.speechSynthesis) {
            alert("Sorry, your browser does not support the Speech Synthesis API.");
            return;
        }

        // If clicking the active speaking step, stop speaking
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            if (speakingIndex === index) {
                setSpeakingIndex(null);
                return;
            }
        }

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Select a premium warm English voice if available
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(voice => 
            voice.lang.startsWith('en') && 
            (voice.name.includes('Google') || voice.name.includes('Natural') || voice.name.includes('Premium'))
        ) || voices.find(voice => voice.lang.startsWith('en'));

        if (englishVoice) {
            utterance.voice = englishVoice;
        }

        utterance.pitch = 1.05; // Slightly warmer/friendly pitch
        utterance.rate = 0.95;  // Extremely clear and paced rate for cooking

        utterance.onend = () => {
            setSpeakingIndex(null);
        };

        utterance.onerror = () => {
            setSpeakingIndex(null);
        };

        setSpeakingIndex(index);
        window.speechSynthesis.speak(utterance);
    };

    // Reference values for nutrient progress bars
    const refValues = {
        calories: 2000, // 2000 kcal
        protein: 50,    // 50g
        carbs: 300,   // 300g
        fat: 65         // 65g
    };

    const getPercentage = (value, max) => {
        return Math.min(Math.round((value / max) * 100), 100);
    };

    const scaleAmountString = (amountStr, mult) => {
        if (!amountStr) return '';
        const str = String(amountStr).trim();
        
        // Regex to match leading fractions (like "1/2", "3/4")
        const fractionRegex = /^(\d+)\/(\d+)(.*)$/;
        // Regex to match leading mixed numbers (like "1 1/2", "2 1/4")
        const mixedFractionRegex = /^(\d+)\s+(\d+)\/(\d+)(.*)$/;
        // Regex to match leading decimals or integers (like "1.5", "2", "250")
        const decimalRegex = /^(\d+\.?\d*)(.*)$/;

        let value = 0;
        let rest = '';

        if (mixedFractionRegex.test(str)) {
            const match = str.match(mixedFractionRegex);
            const whole = parseFloat(match[1]);
            const num = parseFloat(match[2]);
            const den = parseFloat(match[3]);
            value = whole + (num / den);
            rest = match[4];
        } else if (fractionRegex.test(str)) {
            const match = str.match(fractionRegex);
            const num = parseFloat(match[1]);
            const den = parseFloat(match[2]);
            value = num / den;
            rest = match[3];
        } else if (decimalRegex.test(str)) {
            const match = str.match(decimalRegex);
            value = parseFloat(match[1]);
            rest = match[2];
        } else {
            // No leading number found, return the string as is (e.g. "salt to taste")
            return str;
        }

        // Scale the numeric part
        const scaledVal = parseFloat((value * mult).toFixed(2));
        
        // Combine back with the rest of the string
        return `${scaledVal}${rest}`;
    };

    return (
        <section id="recipe-section" className="suggested-recipe-container" aria-live="polite">
            <div className="recipe-header">
                <h2 className="recipe-recommends-title">Chef Llama Recommends:</h2>
                <h3 className="recipe-main-name">{recipe.recipeName}</h3>
                <p className="recipe-intro-line">Here's a recipe recommendation for you, making use of your flavorful ingredients!</p>
                <p className="recipe-desc">{recipe.description}</p>
                
                <div className="recipe-meta-grid">
                    <div className="meta-item">
                        <span className="meta-label">Prep Time</span>
                        <span className="meta-value">{recipe.prepTime}</span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label">Cook Time</span>
                        <span className="meta-value">{recipe.cookTime}</span>
                    </div>
                    <div className="meta-item servings-control-item">
                        <span className="meta-label">Portion Scale</span>
                        <div className="servings-toggle-group">
                            {[2, 4, 8].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    className={`servings-btn ${servings === num ? 'active' : ''}`}
                                    onClick={() => { setServings(num); activeServingsRef.current = num; }}
                                >
                                    {num} Ppl
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="meta-item print-control-item">
                        <span className="meta-label">Actions</span>
                        <button 
                            onClick={() => window.print()} 
                            className="print-recipe-btn" 
                            type="button"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="print-icon">
                                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                <rect x="6" y="14" width="12" height="8"></rect>
                            </svg>
                            Print
                        </button>
                    </div>
                </div>
            </div>

            <div className="recipe-content-grid">
                <div className="recipe-ingredients-block">
                    <h3>Scaled Ingredients</h3>
                    <ul className="recipe-ingredients-list">
                        {recipe.ingredients.map((ing, idx) => (
                            <li key={idx} className="recipe-ingredient-item">
                                <span className="ingredient-qty">
                                    {scaleAmountString(ing.amount, multiplier)}
                                </span>
                                <span className="ingredient-name-text">{ing.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="recipe-instructions-block">
                    <h3>Step-by-Step Directions</h3>
                    <ol className="recipe-instructions-list">
                        {recipe.instructions.map((step, idx) => (
                            <li 
                                key={idx} 
                                className={`recipe-step-item ${completedSteps[idx] ? 'completed' : ''}`}
                                onClick={() => toggleStep(idx)}
                            >
                                <div className="step-checkbox-container">
                                    <input 
                                        type="checkbox" 
                                        checked={!!completedSteps[idx]} 
                                        readOnly 
                                        className="step-checkbox"
                                    />
                                </div>
                                <span className="step-text">{step}</span>
                                <button 
                                    className={`step-speak-btn ${speakingIndex === idx ? 'speaking' : ''}`}
                                    onClick={(e) => speakStep(step, idx, e)}
                                    aria-label="Speak step out loud"
                                    type="button"
                                >
                                    {speakingIndex === idx ? (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="speaker-icon active-speaking">
                                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                                        </svg>
                                    ) : (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="speaker-icon">
                                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                        </svg>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {recipe.nutritionPerServing && (
                <div id="nutrients-section" className="recipe-nutrition-dashboard">
                    <h3>Nutrition Analysis <span className="nutrition-serving-note">(Per Serving)</span></h3>
                    <div className="nutrition-grid">
                        {/* Calories */}
                        <div className="nutrition-card calories-card">
                            <div className="nutrition-card-header">
                                <span className="nutrition-title">Calories</span>
                                <span className="nutrition-amount">{recipe.nutritionPerServing.calories} kcal</span>
                            </div>
                            <div className="nutrition-progress-bar-container">
                                <div 
                                    className="nutrition-progress-fill" 
                                    style={{ 
                                        width: `${getPercentage(recipe.nutritionPerServing.calories, refValues.calories)}%`,
                                        background: 'linear-gradient(90deg, #F87171, #EF4444)'
                                    }}
                                ></div>
                            </div>
                            <span className="nutrition-footer">{getPercentage(recipe.nutritionPerServing.calories, refValues.calories)}% Daily Value</span>
                        </div>

                        {/* Protein */}
                        <div className="nutrition-card protein-card">
                            <div className="nutrition-card-header">
                                <span className="nutrition-title">Protein</span>
                                <span className="nutrition-amount">{recipe.nutritionPerServing.protein} g</span>
                            </div>
                            <div className="nutrition-progress-bar-container">
                                <div 
                                    className="nutrition-progress-fill" 
                                    style={{ 
                                        width: `${getPercentage(recipe.nutritionPerServing.protein, refValues.protein)}%`,
                                        background: 'linear-gradient(90deg, #34D399, #10B981)'
                                    }}
                                ></div>
                            </div>
                            <span className="nutrition-footer">{getPercentage(recipe.nutritionPerServing.protein, refValues.protein)}% Daily Value</span>
                        </div>

                        {/* Carbs */}
                        <div className="nutrition-card carbs-card">
                            <div className="nutrition-card-header">
                                <span className="nutrition-title">Carbs</span>
                                <span className="nutrition-amount">{recipe.nutritionPerServing.carbs} g</span>
                            </div>
                            <div className="nutrition-progress-bar-container">
                                <div 
                                    className="nutrition-progress-fill" 
                                    style={{ 
                                        width: `${getPercentage(recipe.nutritionPerServing.carbs, refValues.carbs)}%`,
                                        background: 'linear-gradient(90deg, #FBBF24, #F59E0B)'
                                    }}
                                ></div>
                            </div>
                            <span className="nutrition-footer">{getPercentage(recipe.nutritionPerServing.carbs, refValues.carbs)}% Daily Value</span>
                        </div>

                        {/* Fat */}
                        <div className="nutrition-card fat-card">
                            <div className="nutrition-card-header">
                                <span className="nutrition-title">Fat</span>
                                <span className="nutrition-amount">{recipe.nutritionPerServing.fat} g</span>
                            </div>
                            <div className="nutrition-progress-bar-container">
                                <div 
                                    className="nutrition-progress-fill" 
                                    style={{ 
                                        width: `${getPercentage(recipe.nutritionPerServing.fat, refValues.fat)}%`,
                                        background: 'linear-gradient(90deg, #818CF8, #6366F1)'
                                    }}
                                ></div>
                            </div>
                            <span className="nutrition-footer">{getPercentage(recipe.nutritionPerServing.fat, refValues.fat)}% Daily Value</span>
                        </div>
                    </div>
                </div>
            )}

            {recipe.alternativeRecipes && recipe.alternativeRecipes.length > 0 && (
                <div id="alternatives-section" className="recipe-variations-section">
                    <h3>Alternative Recipes You Can Make</h3>
                    <p className="variations-subtitle">Explore 4 alternative recipes that can be made by adding or replacing a few ingredients:</p>
                    <div className="variations-grid">
                        {recipe.alternativeRecipes.map((alt, idx) => (
                            <div key={idx} className="variation-card">
                                <div className="variation-badge">Recipe Idea {idx + 1}</div>
                                <h4>{alt.recipeName}</h4>
                                <div className="adjustment-pill">{alt.adjustments}</div>
                                <p>{alt.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    )
}
