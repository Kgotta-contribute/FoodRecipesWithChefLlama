import { useState, useEffect } from 'react'
import './Header.css'
import logo from '../assets/chef2.png'

export default function Header({ activeTab, setActiveTab, onOpenAbout, onOpenFavorites, favoritesCount = 0 }) {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <header className="main-header">
            <div className="header-brand-container" onClick={() => setActiveTab && setActiveTab('home')}>
                <img id="logo" src={logo} alt="Chef Llama logo" />
                <div className="brand-text-block">
                    <h1 id="title">Chef <span className="brand-accent">Llama</span></h1>
                    <p className="brand-subtitle">Turn Ingredients into Delicious Possibilities</p>
                </div>
            </div>

            <nav className="header-nav-pill-bar" aria-label="Main Navigation">
                <button 
                    type="button" 
                    className={`nav-pill-btn ${(activeTab === 'home' || !activeTab) ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab && setActiveTab('home');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    <span className="nav-icon">🏠</span>
                    <span className="nav-label">Home</span>
                </button>

                <button 
                    type="button" 
                    className={`nav-pill-btn ${activeTab === 'recipes' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab && setActiveTab('recipes');
                        const recipeEl = document.getElementById('recipe-section') || document.querySelector('.suggested-recipe-container');
                        if (recipeEl) {
                            recipeEl.scrollIntoView({ behavior: 'smooth' });
                        } else {
                            const cta = document.querySelector('.get-recipe-hero-btn') || document.querySelector('.ingredient-discovery-board');
                            if (cta) cta.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                >
                    <span className="nav-icon">📖</span>
                    <span className="nav-label">Recipes</span>
                </button>

                <button 
                    type="button" 
                    className={`nav-pill-btn ${activeTab === 'nutrients' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab && setActiveTab('nutrients');
                        const nutrientsEl = document.getElementById('nutrients-section') || document.querySelector('.recipe-nutrition-dashboard');
                        if (nutrientsEl) {
                            nutrientsEl.scrollIntoView({ behavior: 'smooth' });
                        } else {
                            const cta = document.querySelector('.get-recipe-hero-btn') || document.querySelector('.ingredient-discovery-board');
                            if (cta) cta.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                >
                    <span className="nav-icon">📊</span>
                    <span className="nav-label">Nutrients</span>
                </button>

                <button 
                    type="button" 
                    className={`nav-pill-btn ${activeTab === 'alternatives' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab && setActiveTab('alternatives');
                        const altEl = document.getElementById('alternatives-section') || document.querySelector('.recipe-variations-section');
                        if (altEl) {
                            altEl.scrollIntoView({ behavior: 'smooth' });
                        } else {
                            const cta = document.querySelector('.get-recipe-hero-btn') || document.querySelector('.ingredient-discovery-board');
                            if (cta) cta.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                >
                    <span className="nav-icon">💡</span>
                    <span className="nav-label">Alternatives</span>
                </button>
            </nav>

            <div className="header-actions">
                <a 
                    href="https://github.com/Kgotta-contribute/FoodRecipesWithChefLlama" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="github-header-link"
                    aria-label="GitHub Repository"
                    title="View on GitHub"
                >
                    <svg className="github-icon-svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                </a>

                <button 
                    className={`theme-pill-switch ${darkMode ? 'dark-active' : 'light-active'}`} 
                    onClick={() => setDarkMode(!darkMode)}
                    aria-label="Toggle Theme"
                    type="button"
                >
                    <span className="theme-option sun-option">☀️</span>
                    <span className="theme-option moon-option">🌙</span>
                    <div className="theme-pill-slider"></div>
                </button>
            </div>
        </header>
    )
}