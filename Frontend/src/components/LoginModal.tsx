import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { authService } from '../services/authService';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, setUser, setToken, setPlan } = useStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Hidden feature prep for signup

  if (!loginModalOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // Backend ready logic
      const response = isSignUp
        ? await authService.signup(email, 'default-password-for-now')
        : await authService.login(email, 'default-password-for-now');

      setUser(response.user);
      setToken(response.token);
      setPlan(response.plan);

      toast.success(isSignUp ? 'Account created successfully!' : 'Successfully logged in!');
      setLoginModalOpen(false);
    } catch (error) {
      toast.error('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100 dark:border-slate-700">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Sign in to CareerForge
          </h2>
          <button
            onClick={() => setLoginModalOpen(false)}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 p-2 rounded-full transition-all duration-200 shadow-sm border border-transparent dark:border-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAuth} className="p-8 space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all bg-gray-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue with Email'}
          </button>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6 leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            <br />
            <span
              className="text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? '(Creating new account - Any email works)'
                : '(This is API-ready, any email works).'}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
