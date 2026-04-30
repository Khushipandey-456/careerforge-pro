import { useStore } from '../store/useStore';
import { Menu, Moon, Sun, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, setLoginModalOpen, setUser, setPlan, theme, setTheme, setSidebarOpen } = useStore();

  const handleLogout = () => {
    setUser(null);
    setPlan('guest');
  };

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200/80 dark:border-slate-800/80 sticky top-0 z-30 shadow-sm transition-all">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="p-2.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 hidden sm:block"
                >
                  Log in
                </button>
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
