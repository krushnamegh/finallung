
import React, { useEffect, useState } from 'react';
import { Activity, User, LogOut, Moon, Sun, Wifi, WifiOff } from 'lucide-react';
import { AppView, User as UserType } from '../types';

interface NavbarProps {
  currentView: AppView;
  user: UserType | null;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, user, onNavigate, onLogout, isDarkMode, toggleTheme }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200 dark:border-slate-800 h-16 transition-all duration-300 dark:bg-slate-900/90 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => onNavigate(AppView.LANDING)}
        >
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/30">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
            PulmoScan AI
          </span>
        </div>

        <div className="flex items-center space-x-4 md:space-x-6">
          
          {/* Connection Status */}
          <div className={`flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full ${isOnline ? 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400' : 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'}`}>
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span className="hidden sm:inline">{isOnline ? 'System Online' : 'Offline Mode'}</span>
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-600 dark:text-gray-300"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {user ? (
            <>
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-slate-700">
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-slate-800 flex items-center justify-center border border-blue-200 dark:border-slate-700">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Dr. {user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{user.role}</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            currentView === AppView.LANDING && (
              <button
                onClick={() => onNavigate(AppView.LOGIN)}
                className="px-5 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transform hover:-translate-y-0.5"
              >
                Doctor Portal
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
