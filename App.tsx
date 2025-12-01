
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import LoginForm from './components/LoginForm';
import Footer from './components/Footer';
import { AppView, User } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle Dark Mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply 'dark' class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(AppView.LANDING);
  };

  const navigate = (view: AppView) => {
    // Protect dashboard route
    if (view === AppView.DASHBOARD && !user) {
      setCurrentView(AppView.LOGIN);
      return;
    }
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar 
        currentView={currentView}
        user={user}
        onNavigate={navigate}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      
      <main className="flex-grow">
        {currentView === AppView.LANDING && (
          <LandingPage onNavigate={navigate} />
        )}
        
        {currentView === AppView.LOGIN && (
          <LoginForm onLogin={handleLogin} />
        )}
        
        {currentView === AppView.DASHBOARD && user && (
          <Dashboard />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
