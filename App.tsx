import React, { useState, useEffect, createContext, useContext } from 'react';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { ServiceMode } from './types';

// --- Theme Context ---
interface ThemeContextType {
  mode: ServiceMode;
  toggleMode: () => void;
  setMode: (mode: ServiceMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

const App: React.FC = () => {
  const [mode, setModeState] = useState<ServiceMode>('aluminium');
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const savedMode = localStorage.getItem('app_mode') as ServiceMode;
    if (savedMode) setModeState(savedMode);
  }, []);

  const setMode = (newMode: ServiceMode) => {
    setModeState(newMode);
    localStorage.setItem('app_mode', newMode);
  };

  const toggleMode = () => {
    const newMode = mode === 'aluminium' ? 'painting' : 'aluminium';
    setMode(newMode);
  };

  // Simple routing logic based on hash
  // If hash starts with #/admin, show Admin, otherwise Home
  const isHome = !currentHash.startsWith('#/admin');

  // Scroll Handling
  useEffect(() => {
    if (currentHash === '' || currentHash === '#/' || currentHash === '#/admin') {
      // Scroll to top for root routes
      window.scrollTo(0, 0);
    } else if (isHome && currentHash.includes('#')) {
      // Handle anchor scrolling (e.g. #gallery, #services)
      // We use a small timeout to ensure the DOM is rendered if we just switched views
      const id = currentHash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [currentHash, isHome]);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, setMode }}>
      {isHome ? <Home /> : <Admin />}
    </ThemeContext.Provider>
  );
};

export default App;