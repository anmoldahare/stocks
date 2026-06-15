import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import { AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Check for stored token and user on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  if (isLoggedIn) {
    return <Dashboard user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F1A] relative selection:bg-primary/30 selection:text-primary-foreground text-slate-800 dark:text-slate-200 transition-colors duration-200">
      {/* Top Navigation */}
      <nav className="absolute top-0 w-full z-50 px-6 py-4 mt-12 md:mt-16 flex justify-between items-center max-w-7xl mx-auto left-0 right-0 pointer-events-none">
        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-slate-900">
            IA
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">InvestAI</span>
        </div>
        <div className="hidden md:flex items-center space-x-8 pointer-events-auto">
          
        </div>
        <div className="pointer-events-auto flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors p-1"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setShowAuth(true)}
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Log in
          </button>
        </div>
      </nav>

      <LandingPage onGetStarted={() => setShowAuth(true)} />

      <AnimatePresence>
        {showAuth && (
          <AuthPage 
            onClose={() => setShowAuth(false)} 
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
