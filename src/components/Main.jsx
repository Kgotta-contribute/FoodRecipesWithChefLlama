import { useState, useRef, useEffect } from 'react'
import './Main.css'
import HuggingFaceRecipe from './HuggingFaceRecipe.jsx'
import { getRecipeFromMistral } from '../ai.js'
import chefMascot from '../assets/chef2.png'

const INGREDIENT_EMOJIS = {
    cheese: "🧀",
    bread: "🍞",
    jalapeno: "🌶️",
    jalapeño: "🌶️",
    onion: "🧅",
    tomato: "🍅",
    capsicum: "🫑",
    "cream cheese": "🥣",
    olive: "🫒",
    mushroom: "🍄",
    garlic: "🧄",
    potato: "🥔",
    carrot: "🥕",
    spinach: "🥬",
    broccoli: "🥦",
    cucumber: "🥒",
    milk: "🥛",
    butter: "🧈",
    "heavy cream": "🍦",
    yogurt: "🍶",
    parmesan: "🧀",
    mozzarella: "🧀",
    rice: "🍚",
    pasta: "🍝",
    oats: "🌾",
    flour: "🫓",
    noodles: "🍜",
    baguette: "🥖",
    tortilla: "🌮",
    chicken: "🍗",
    beef: "🥩",
    eggs: "🥚",
    egg: "🥚",
    salmon: "🐟",
    shrimp: "🍤",
    tofu: "🍢",
    bacon: "🥓",
    beans: "🫘",
    "garlic powder": "🧄",
    "chili flakes": "🌶️",
    oregano: "🌿",
    basil: "🌿",
    "black pepper": "🧂",
    salt: "🧂",
    "olive oil": "🫒",
    ginger: "🫚",
    lemon: "🍋",
    avocado: "🥑",
    apple: "🍎",
    banana: "🍌",
    strawberries: "🍓",
    blueberries: "🫐",
    mango: "🥭",
    orange: "🍊",
    corn: "🌽",
    paneer: "🧀",
    cilantro: "🌿",
    coriander: "🌿",
    pepper: "🌶️",
    pork: "🥩",
    sugar: "🍬",
    honey: "🍯",
    chocolate: "🍫"
};

function getEmoji(name) {
    const lower = name.toLowerCase().trim();
    if (INGREDIENT_EMOJIS[lower]) return INGREDIENT_EMOJIS[lower];
    for (const [key, emoji] of Object.entries(INGREDIENT_EMOJIS)) {
        if (lower.includes(key)) return emoji;
    }
    return "🥗";
}

const CATEGORIES = [
    {
        id: 'popular',
        name: 'Popular',
        icon: '🔥',
        items: [
            { name: 'Cheese', emoji: '🧀' },
            { name: 'Bread', emoji: '🍞' },
            { name: 'Jalapeno', emoji: '🌶️' },
            { name: 'Onion', emoji: '🧅' },
            { name: 'Tomato', emoji: '🍅' },
            { name: 'Capsicum', emoji: '🫑' },
            { name: 'Cream Cheese', emoji: '🥣' },
            { name: 'Olive', emoji: '🫒' },
            { name: 'Mushroom', emoji: '🍄' },
            { name: 'Garlic', emoji: '🧄' },
        ]
    },
    {
        id: 'vegetables',
        name: 'Vegetables',
        icon: '🥬',
        items: [
            { name: 'Tomato', emoji: '🍅' },
            { name: 'Onion', emoji: '🧅' },
            { name: 'Garlic', emoji: '🧄' },
            { name: 'Potato', emoji: '🥔' },
            { name: 'Carrot', emoji: '🥕' },
            { name: 'Spinach', emoji: '🥬' },
            { name: 'Broccoli', emoji: '🥦' },
            { name: 'Capsicum', emoji: '🫑' },
            { name: 'Cucumber', emoji: '🥒' },
            { name: 'Mushroom', emoji: '🍄' },
        ]
    },
    {
        id: 'dairy',
        name: 'Dairy',
        icon: '🥛',
        items: [
            { name: 'Cheese', emoji: '🧀' },
            { name: 'Milk', emoji: '🥛' },
            { name: 'Butter', emoji: '🧈' },
            { name: 'Cream Cheese', emoji: '🥣' },
            { name: 'Yogurt', emoji: '🍶' },
            { name: 'Parmesan', emoji: '🧀' },
            { name: 'Mozzarella', emoji: '🧀' },
            { name: 'Heavy Cream', emoji: '🍦' },
            { name: 'Paneer', emoji: '🧀' },
            { name: 'Cottage Cheese', emoji: '🥣' },
        ]
    },
    {
        id: 'grains',
        name: 'Grains',
        icon: '🌾',
        items: [
            { name: 'Bread', emoji: '🍞' },
            { name: 'Rice', emoji: '🍚' },
            { name: 'Pasta', emoji: '🍝' },
            { name: 'Oats', emoji: '🌾' },
            { name: 'Flour', emoji: '🫓' },
            { name: 'Noodles', emoji: '🍜' },
            { name: 'Baguette', emoji: '🥖' },
            { name: 'Tortilla', emoji: '🌮' },
            { name: 'Quinoa', emoji: '🌾' },
            { name: 'Corn', emoji: '🌽' },
        ]
    },
    {
        id: 'proteins',
        name: 'Proteins',
        icon: '🍗',
        items: [
            { name: 'Chicken', emoji: '🍗' },
            { name: 'Eggs', emoji: '🥚' },
            { name: 'Beef', emoji: '🥩' },
            { name: 'Salmon', emoji: '🐟' },
            { name: 'Shrimp', emoji: '🍤' },
            { name: 'Tofu', emoji: '🍢' },
            { name: 'Bacon', emoji: '🥓' },
            { name: 'Beans', emoji: '🫘' },
            { name: 'Pork', emoji: '🥩' },
            { name: 'Turkey', emoji: '🍗' },
        ]
    },
    {
        id: 'spices',
        name: 'Spices',
        icon: '🌶️',
        items: [
            { name: 'Black Pepper', emoji: '🧂' },
            { name: 'Salt', emoji: '🧂' },
            { name: 'Garlic Powder', emoji: '🧄' },
            { name: 'Chili Flakes', emoji: '🌶️' },
            { name: 'Oregano', emoji: '🌿' },
            { name: 'Basil', emoji: '🌿' },
            { name: 'Olive Oil', emoji: '🫒' },
            { name: 'Ginger', emoji: '🫚' },
            { name: 'Cinnamon', emoji: '🪵' },
            { name: 'Turmeric', emoji: '🌿' },
        ]
    },
    {
        id: 'fruits',
        name: 'Fruits',
        icon: '🍎',
        items: [
            { name: 'Lemon', emoji: '🍋' },
            { name: 'Avocado', emoji: '🥑' },
            { name: 'Apple', emoji: '🍎' },
            { name: 'Banana', emoji: '🍌' },
            { name: 'Strawberries', emoji: '🍓' },
            { name: 'Blueberries', emoji: '🫐' },
            { name: 'Mango', emoji: '🥭' },
            { name: 'Orange', emoji: '🍊' },
            { name: 'Pineapple', emoji: '🍍' },
            { name: 'Lime', emoji: '🍋' },
        ]
    }
];

export default function Main({ isAboutOpen, setIsAboutOpen, isFavoritesOpen, setIsFavoritesOpen, favorites, setFavorites }) {
    const [ingredientsList, setIngredientsList] = useState([]);
    const [activeCategory, setActiveCategory] = useState('popular');
    const [categorySearch, setCategorySearch] = useState('');
    const [showMore, setShowMore] = useState(false);
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState(null);
    const [inedibleWarning, setInedibleWarning] = useState(null);
    const [loading, setLoading] = useState(false);
    const recipeSectionRef = useRef(null);

    useEffect(() => {
        if ((recipe || error || inedibleWarning) && recipeSectionRef.current !== null) {
            recipeSectionRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [recipe, error, inedibleWarning]);

    function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const input = form.elements['ingredient'];
        const val = input.value.trim();
        if (val) {
            addIngredient(val);
            input.value = '';
        }
    }

    function addIngredient(newIngredient) {
        if (!newIngredient) return;
        if (ingredientsList.some(item => item.toLowerCase() === newIngredient.toLowerCase())) {
            return;
        }
        setIngredientsList(prev => [...prev, newIngredient]);
        if (inedibleWarning) setInedibleWarning(null);
    }

    function removeIngredient(indexToRemove) {
        setIngredientsList(prev => prev.filter((_, index) => index !== indexToRemove));
        if (inedibleWarning) setInedibleWarning(null);
    }

    function toggleIngredient(item) {
        const name = typeof item === 'string' ? item : item.name;
        if (ingredientsList.some(i => i.toLowerCase() === name.toLowerCase())) {
            setIngredientsList(prev => prev.filter(i => i.toLowerCase() !== name.toLowerCase()));
        } else {
            addIngredient(name);
        }
        if (inedibleWarning) setInedibleWarning(null);
    }

    function clearAllIngredients() {
        setIngredientsList([]);
        setInedibleWarning(null);
    }

    async function getRecipe() {
        if (ingredientsList.length <= 3) {
            setError("Please add more than 3 ingredients (at least 4) to let Chef Llama cook!");
            return;
        }
        setLoading(true);
        setRecipe(null);
        setError(null);
        setInedibleWarning(null);

        try {
            const recipeContent = await getRecipeFromMistral(ingredientsList);
            if (recipeContent && recipeContent.isEdible === false) {
                setInedibleWarning(recipeContent);
                setRecipe(null);
            } else {
                setRecipe(recipeContent);
                setInedibleWarning(null);
            }
        } catch (err) {
            console.error("Error generating recipe:", err);
            setError(err.message || "Chef Llama encountered an issue in the kitchen. Please try again!");
        } finally {
            setLoading(false);
        }
    }

    const currentCatObj = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];
    const filteredItems = currentCatObj.items.filter(item => 
        item.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    return (
        <main className="chef-dashboard-main">
            {/* Hero Section with Mascot and Speech Bubble */}
            <section className="hero-kitchen-section">
                <div className="mascot-side-container">
                    <div className="speech-bubble-wrapper">
                        <div className="mascot-speech-bubble">
                            <span>• Cook</span>
                            <span>Create</span>
                            <span>Enjoy! ♡</span>
                        </div>
                    </div>
                    <div className="mascot-avatar-circle">
                        <img src={chefMascot} alt="Chef Llama" className="chef-mascot-img" />
                    </div>
                </div>

                <div className="hero-center-content">
                    <h2 className="hero-main-title">
                        What's in your <span className="highlight-kitchen">kitchen</span> today?
                    </h2>
                    <p className="hero-sub-title">
                        Add more than 3 ingredients and let Chef Llama create something amazing!
                    </p>

                    <form className="hero-search-form" onSubmit={handleFormSubmit}>
                        <div className="search-input-wrapper">
                            <span className="search-icon-decor">🔍</span>
                            <input
                                type="text"
                                placeholder="e.g. jalapeño, chicken, rice..."
                                aria-label="Add Ingredient"
                                name="ingredient"
                            />
                        </div>
                        <button type="submit" className="add-ingredient-pill-btn">
                            + Add Ingredient
                        </button>
                    </form>
                </div>

                <div className="hero-right-decorative">
                    <div className="whimsical-text-note">
                        <p className="whimsical-line-1">Good</p>
                        <p className="whimsical-line-2">Food</p>
                        <p className="whimsical-line-3">Happier</p>
                        <p className="whimsical-line-4">You ♡</p>
                    </div>
                </div>
            </section>

            {/* Selected "Your Ingredients" Drawer Bar */}
            <section className="your-ingredients-card">
                <div className="your-ingredients-header">
                    <div className="your-ingredients-title-block">
                        <span className="basket-icon">🧺</span>
                        <h3>Your Ingredients</h3>
                        <span className="ingredient-count-badge">({ingredientsList.length} items)</span>
                    </div>
                    {ingredientsList.length > 0 && (
                        <button 
                            type="button" 
                            className="clear-all-btn"
                            onClick={clearAllIngredients}
                        >
                            <span className="trash-icon">🗑️</span> Clear All
                        </button>
                    )}
                </div>

                <div className="selected-chips-container">
                    {ingredientsList.length === 0 ? (
                        <p className="empty-chips-hint">
                            Tap any ingredients from the board below or type in your own (add more than 3 ingredients to cook)!
                        </p>
                    ) : (
                        ingredientsList.map((ing, idx) => (
                            <div key={idx} className="ingredient-chip-pill">
                                <span className="chip-emoji">{getEmoji(ing)}</span>
                                <span className="chip-label">{ing}</span>
                                <button 
                                    type="button" 
                                    className="chip-close-btn"
                                    onClick={() => removeIngredient(idx)}
                                    aria-label={`Remove ${ing}`}
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Categorized Ingredient Discovery Board */}
            <section className="ingredient-discovery-board">
                {/* Left Category Sidebar */}
                <aside className="category-sidebar">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            type="button"
                            className={`category-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => {
                                setActiveCategory(cat.id);
                                setCategorySearch('');
                            }}
                        >
                            <span className="cat-icon">{cat.icon}</span>
                            <span className="cat-name">{cat.name}</span>
                        </button>
                    ))}
                </aside>

                {/* Right Category Content & Cards Grid */}
                <div className="category-content-area">
                    <div className="category-content-header">
                        <h3 className="category-display-title">
                            {currentCatObj.name} Ingredients
                        </h3>
                        <div className="category-mini-search">
                            <span className="mini-search-icon">🔍</span>
                            <input 
                                type="text" 
                                placeholder="Search ingredients..." 
                                value={categorySearch}
                                onChange={(e) => setCategorySearch(e.target.value)}
                            />
                            {categorySearch && (
                                <button 
                                    className="clear-search-btn" 
                                    onClick={() => setCategorySearch('')}
                                    type="button"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="ingredients-grid-cards">
                        {filteredItems.map((item, idx) => {
                            const isSelected = ingredientsList.some(
                                i => i.toLowerCase() === item.name.toLowerCase()
                            );
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`ingredient-box-card ${isSelected ? 'selected' : ''}`}
                                    onClick={() => toggleIngredient(item)}
                                >
                                    <div className="ingredient-icon-graphic">
                                        <span className="food-emoji">{item.emoji}</span>
                                    </div>
                                     <span className="ingredient-card-title">{item.name}</span>
                                    {isSelected && <span className="selected-check-indicator">✓</span>}
                                </button>
                            );
                        })}
                    </div>

                    {/* Big Main Action CTA Button */}
                    <div className="main-cta-section">
                        <button
                            type="button"
                            className="get-recipe-hero-btn"
                            onClick={getRecipe}
                            disabled={loading || ingredientsList.length <= 3}
                            title={ingredientsList.length <= 3 ? "Add more than 3 ingredients to unlock" : "Get a Recipe"}
                        >
                            {loading ? (
                                <span className="btn-loading-content">
                                    <span className="spinner-sparkle">🍳</span> Chef Llama is cooking...
                                </span>
                            ) : (
                                <>
                                    <span className="sparkle-icon">✨</span>
                                    <span className="btn-text">
                                        {ingredientsList.length <= 3
                                            ? `Add ${4 - ingredientsList.length} Ingredient${(4 - ingredientsList.length) > 1 ? 's' : ''}`
                                            : 'Get a Recipe'}
                                    </span>
                                    <span className="arrow-icon">➔</span>
                                </>
                            )}
                        </button>
                        <p className="cta-whimsical-tagline">
                            {ingredientsList.length <= 3
                                ? `Add at least ${4 - ingredientsList.length} ingredient${(4 - ingredientsList.length) > 1 ? 's' : ''} to cook! ♡`
                                : 'Same Ingredients. Endless Possibilities. ♡'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Inedible Items Warning Alert Card */}
            {inedibleWarning && (
                <div ref={recipeSectionRef} className="inedible-warning-card">
                    <div className="inedible-warning-header">
                        <div className="inedible-mascot-avatar">
                            <img src={chefMascot} alt="Chef Llama Warning" />
                        </div>
                        <div className="inedible-header-text">
                            <h3>🍽️ Inedible Items Detected!</h3>
                            <p className="inedible-subtitle">Chef Llama only cooks with genuine, edible kitchen ingredients.</p>
                        </div>
                    </div>
                    <p className="inedible-explanation-text">
                        {inedibleWarning.message || "Chef Llama checked your pantry, but non-food items cannot be cooked into a meal! Please choose real culinary ingredients."}
                    </p>
                    {inedibleWarning.invalidItems && inedibleWarning.invalidItems.length > 0 && (
                        <div className="inedible-tags-row">
                            <span className="inedible-tag-label">Non-food items detected:</span>
                            <div className="inedible-pills-wrap">
                                {inedibleWarning.invalidItems.map((item, idx) => (
                                    <span key={idx} className="inedible-item-pill">
                                        🚫 {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="inedible-action-row">
                        <button 
                            type="button" 
                            className="inedible-reset-btn"
                            onClick={() => {
                                if (inedibleWarning.invalidItems && inedibleWarning.invalidItems.length > 0) {
                                    setIngredientsList(prev => prev.filter(i => !inedibleWarning.invalidItems.some(inv => inv.toLowerCase().trim() === i.toLowerCase().trim())));
                                } else {
                                    setIngredientsList([]);
                                }
                                setInedibleWarning(null);
                            }}
                        >
                            🧹 Remove Non-Food Items
                        </button>
                    </div>
                </div>
            )}

            {/* Error Message Alert */}
            {error && (
                <div className="error-message caution-text" ref={recipeSectionRef}>
                    ⚠️ {error}
                </div>
            )}

            {/* Recipe Output Section */}
            {recipe && (
                <div ref={recipeSectionRef} className="recipe-anchor-section">
                    <HuggingFaceRecipe 
                        recipe={recipe} 
                        onSaveFavorite={(favRecipe) => {
                            if (setFavorites) {
                                setFavorites(prev => {
                                    const exists = prev.some(r => r.recipeName === favRecipe.recipeName);
                                    if (exists) return prev;
                                    const updated = [...prev, favRecipe];
                                    localStorage.setItem('chef_llama_favorites', JSON.stringify(updated));
                                    return updated;
                                });
                            }
                        }}
                    />
                </div>
            )}

            {/* Bottom Rustic Counter Wooden Board Footer Banner */}
            <footer className="kitchen-rustic-footer-banner">
                <div className="rustic-counter-wood-board">
                    <div className="counter-side-accents counter-left-accents">
                        <span className="counter-food-item tomato-item" title="Fresh Tomato">🍅</span>
                        <span className="counter-food-item garlic-item" title="Garlic Bulb">🧄</span>
                        <span className="counter-herb-leaf" title="Fresh Herbs">🌿</span>
                    </div>
                    <div className="cutting-board-carving">
                        <span className="leaf-decor">🌿</span>
                        <span className="board-text">Good Ingredients Great Meals ♡</span>
                        <span className="leaf-decor">🌿</span>
                    </div>
                    <div className="counter-side-accents counter-right-accents">
                        <span className="counter-herb-leaf" title="Fresh Basil">🌿</span>
                        <span className="counter-food-item pepper-item" title="Chili">🌶️</span>
                        <span className="counter-food-item olive-item" title="Olives">🫒</span>
                    </div>
                </div>
            </footer>

            {/* About Modal */}
            {isAboutOpen && (
                <div className="modal-backdrop" onClick={() => setIsAboutOpen(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title-wrap">
                                <h3>About Chef Llama</h3>
                                <p className="modal-subtitle">AI Culinary Assistant powered by Gemini 3.5 Flash</p>
                            </div>
                            <button className="modal-close-btn" onClick={() => setIsAboutOpen(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <p>
                                <strong>Chef Llama</strong> transforms whatever ingredients you have in your pantry into gourmet, chemically accurate recipes with real-time portion scaling and nutrition estimation.
                            </p>
                            <ul>
                                <li>✨ <strong>Smart Pantry Matcher</strong>: Uses fuzzy typo correction & biochemical culinary rules.</li>
                                <li>🔊 <strong>Hands-free Voice Narration</strong>: Step-by-step text-to-speech audio reader.</li>
                                <li>⚖️ <strong>Dynamic Portion Scaler</strong>: Instant fraction multiplication for 2, 4, or 8 guests.</li>
                                <li>📊 <strong>Macro Analytics</strong>: Estimates Calories, Protein, Carbs, and Fats (% Daily Values).</li>
                                <li>🖨️ <strong>Print Ready</strong>: Automatic single-page clean cookbook print layout.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Favorites Modal */}
            {isFavoritesOpen && (
                <div className="modal-backdrop" onClick={() => setIsFavoritesOpen(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title-wrap">
                                <h3>Saved Favorites</h3>
                                <p className="modal-subtitle">Your collection of delicious recipes</p>
                            </div>
                            <button className="modal-close-btn" onClick={() => setIsFavoritesOpen(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            {!favorites || favorites.length === 0 ? (
                                <p className="empty-fav-msg">No favorite recipes saved yet. Generate a recipe and tap the heart icon to save it here!</p>
                            ) : (
                                <div className="favorites-list">
                                    {favorites.map((fav, i) => (
                                        <div key={i} className="favorite-recipe-card" onClick={() => {
                                            setRecipe(fav);
                                            setIsFavoritesOpen(false);
                                        }}>
                                            <h4>{fav.recipeName}</h4>
                                            <p>{fav.description}</p>
                                            <span className="fav-cook-time">⏱️ {fav.prepTime} prep • {fav.cookTime} cook</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}