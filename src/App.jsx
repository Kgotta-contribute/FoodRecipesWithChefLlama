import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import Main from './components/Main.jsx'

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('chef_llama_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  return (
    <>
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        favoritesCount={favorites.length}
      />
      <Main 
        isAboutOpen={isAboutOpen}
        setIsAboutOpen={setIsAboutOpen}
        isFavoritesOpen={isFavoritesOpen}
        setIsFavoritesOpen={setIsFavoritesOpen}
        favorites={favorites}
        setFavorites={setFavorites}
      />
    </>
  )
}
