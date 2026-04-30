import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { LayoutDashboard, FileEdit, CreditCard, X, FileText } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, user, plan } = useStore();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Resume Editor', path: '/editor/new', icon: FileEdit },
    { name: 'Pricing', path: '/pricing', icon: CreditCard },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out flex flex-col flex-shrink-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-0.5">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-gray-900 dark:text-white">
              CareerForge
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path.startsWith('/editor') && location.pathname.startsWith('/editor'));
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive
                      ? 'text-white dark:text-gray-900'
                      : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section at bottom */}
        {user && (
          <div className="p-4 border-t border-gray-200 dark:border-slate-800">
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-4 flex items-center gap-3 border border-gray-100 dark:border-slate-700/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-inner">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{plan} Plan</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
