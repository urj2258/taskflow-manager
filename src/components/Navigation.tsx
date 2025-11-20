import { User, Bell } from 'lucide-react';

const Navigation = () => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="h-full px-6 lg:px-8 flex items-center justify-between">
        <div className="hidden lg:block">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Welcome back
          </h2>
        </div>

        {/* Right side - user menu */}
        <div className="flex items-center gap-3 ml-auto">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
