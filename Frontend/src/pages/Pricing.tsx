import { useStore } from '../store/useStore';
import { paymentService } from '../services/paymentService';
import { Check, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Pricing() {
  const { user, plan, setPlan, setLoginModalOpen, isAuthenticated } = useStore();
  const navigate = useNavigate();

  const handleUpgrade = async (newPlan: 'free' | 'pro') => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }

    const toastId = toast.loading('Initiating checkout...');
    try {
      const response = await paymentService.checkout(newPlan);
      // For now, in a non-deployed frontend, we just simulate success locally
      // In reality, we would redirect: window.location.href = response.checkoutUrl;
      setPlan(newPlan);
      toast.success(`Successfully upgraded to ${newPlan.toUpperCase()} plan via Mock Checkout!`, {
        id: toastId,
      });
      navigate('/');
    } catch (error) {
      toast.error('Failed to process upgrade.', { id: toastId });
    }
  };

  return (
    <div className="py-12 sm:py-20 animate-in fade-in duration-500">
      <div className="text-center max-w-3xl mx-auto mb-16 px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400">
          Choose the perfect plan to land your dream job faster.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
        {/* Free Plan */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 sm:p-10 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all duration-300 flex flex-col group">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Basic</h3>
            <p className="text-gray-500 dark:text-gray-400">Perfect for trying out the platform.</p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                $0
              </span>
              <span className="text-gray-500 dark:text-gray-400 font-medium">/forever</span>
            </div>
          </div>

          <ul className="space-y-5 mb-10 flex-1">
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded-full">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              </div>
              <span className="font-medium">Create 1 Resume</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded-full">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              </div>
              <span className="font-medium">Basic Templates</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded-full">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              </div>
              <span className="font-medium">PDF Download</span>
            </li>
            <li className="flex items-center gap-3 text-gray-400 dark:text-gray-600">
              <div className="bg-gray-50 dark:bg-slate-700/50 p-1 rounded-full">
                <Check className="w-4 h-4 text-gray-300 dark:text-gray-500 flex-shrink-0" />
              </div>
              <span>AI ATS Optimization</span>
            </li>
            <li className="flex items-center gap-3 text-gray-400 dark:text-gray-600">
              <div className="bg-gray-50 dark:bg-slate-700/50 p-1 rounded-full">
                <Check className="w-4 h-4 text-gray-300 dark:text-gray-500 flex-shrink-0" />
              </div>
              <span>Unlimited Resumes</span>
            </li>
          </ul>

          <button
            onClick={() => handleUpgrade('free')}
            disabled={plan === 'free'}
            className="w-full py-4 px-6 rounded-2xl font-bold border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            {plan === 'free' ? 'Current Plan' : 'Get Started'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-gray-900 dark:bg-slate-900 rounded-[2rem] p-8 sm:p-10 border border-gray-800 dark:border-slate-800 shadow-2xl flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider shadow-md">
            Most Popular
          </div>
          <div className="mb-8 relative z-10">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              Pro <Sparkles className="w-5 h-5 text-indigo-400" />
            </h3>
            <p className="text-gray-400">Everything you need to beat the ATS.</p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-white tracking-tight">$12</span>
              <span className="text-gray-400 font-medium">/month</span>
            </div>
          </div>

          <ul className="space-y-5 mb-10 flex-1 relative z-10">
            <li className="flex items-center gap-3 text-gray-200">
              <div className="bg-indigo-500/20 p-1 rounded-full">
                <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              </div>
              <span className="font-semibold text-white">Unlimited Resumes</span>
            </li>
            <li className="flex items-center gap-3 text-gray-200">
              <div className="bg-indigo-500/20 p-1 rounded-full">
                <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              </div>
              <span className="font-semibold text-white">AI ATS Optimization</span>
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <div className="bg-indigo-500/20 p-1 rounded-full">
                <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              </div>
              <span className="font-medium">Premium Templates</span>
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <div className="bg-indigo-500/20 p-1 rounded-full">
                <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              </div>
              <span className="font-medium">Cover Letter Generator</span>
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <div className="bg-indigo-500/20 p-1 rounded-full">
                <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              </div>
              <span className="font-medium">Priority Support</span>
            </li>
          </ul>

          <button
            onClick={() => handleUpgrade('pro')}
            disabled={plan === 'pro'}
            className="w-full py-4 px-6 rounded-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/50 hover:shadow-indigo-900/80 relative z-10"
          >
            {plan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
          </button>
        </div>
      </div>
    </div>
  );
}
