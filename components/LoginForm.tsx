
import React, { useState } from 'react';
import { Lock, User as UserIcon, Shield, ChevronRight, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulated network delay
    setTimeout(() => {
      // Mock validation - allow any login for demo purposes if fields are filled
      if (username.length > 0 && password.length > 0) {
        // Format the username to look like a name (e.g., "jdoe" -> "Jdoe")
        const formattedName = username.charAt(0).toUpperCase() + username.slice(1);
        
        onLogin({
          id: '1',
          name: formattedName,
          role: 'doctor',
          email: `${username.toLowerCase()}@hospital.org`
        });
      } else {
        setError('Invalid credentials. Please contact IT support.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 pt-20 transition-colors duration-300">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-gray-100 dark:border-slate-800">
        
        {/* Left Side - Visuals */}
        <div className="w-full md:w-1/2 bg-blue-600 dark:bg-blue-900 relative overflow-hidden p-12 text-white flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-blue-950 dark:to-slate-900 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-8">
              <Shield className="h-8 w-8 text-blue-200" />
              <span className="text-xl font-bold tracking-wider opacity-80">MEDSECURE</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Advanced Diagnostic Intelligence
            </h1>
            <p className="text-blue-100 text-lg max-w-sm">
              Secure access for authorized medical personnel only. 
              Powered by Enterprise ML Vision.
            </p>
          </div>

          <div className="relative z-10 text-sm text-blue-200/60">
            <p>v2.4.0 • Enterprise Edition</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Please enter your provider credentials</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Provider ID / Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all outline-none"
                    placeholder="e.g. Jenkins"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Secure Key</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center py-4 px-4 rounded-xl text-white font-semibold text-base transition-all duration-200 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Access Portal <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-800 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Authorized use only. All activities are monitored and logged.<br/>
                Demo Access: <code className="text-blue-500 font-mono">Any</code> / <code className="text-blue-500 font-mono">Any</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
