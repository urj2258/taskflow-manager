import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  FolderKanban,
  Calendar,
  BarChart3,
  StickyNote,
  Bell,
  Settings,
  CheckSquare,
  X,
  Menu,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/App';

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isCollapsed, setIsCollapsed } = useSidebar();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tasks', label: 'All Tasks', icon: ListTodo },
    { to: '/categories', label: 'Categories', icon: FolderKanban },
    { to: '/calendar', label: 'Calendar', icon: Calendar },
    { to: '/reports', label: 'Reports', icon: BarChart3 },
    { to: '/notes', label: 'Notes', icon: StickyNote },
    { to: '/reminders', label: 'Reminders', icon: Bell },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-700/50 dark:border-slate-600/50">
        <button
          onClick={() => {
            setIsCollapsed(!isCollapsed);
            setIsMobileOpen(false);
          }}
          className="flex items-center gap-3 group w-full hover:opacity-80 transition-opacity duration-200"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105 flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1 text-left">
              <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                TaskFlow
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Student Portal</p>
            </div>
          )}
          {!isCollapsed && (
            <ChevronLeft className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors flex-shrink-0" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-0.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                  'hover:bg-slate-200 dark:hover:bg-slate-700/50',
                  isActive
                    ? 'bg-slate-200 dark:bg-slate-700/50 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
                  isCollapsed && 'justify-center'
                )
              }
              title={isCollapsed ? label : undefined}
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator - left bar */}
                  {isActive && !isCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r" />
                  )}
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-colors duration-200 flex-shrink-0',
                      isActive ? 'text-blue-500' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                    )}
                  />
                  {!isCollapsed && (
                    <span className={cn(
                      'font-medium text-sm whitespace-nowrap',
                      isActive ? 'text-slate-900 dark:text-white' : ''
                    )}>
                      {label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Sidebar Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-300 dark:border-slate-700/50">
          <div className="bg-slate-100 dark:bg-slate-700/30 rounded-lg p-3 border border-slate-200 dark:border-slate-600/30">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-semibold">💡</span>
              </div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Quick Tip</p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Use Ctrl+K for quick navigation
            </p>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex fixed left-0 top-0 h-screen bg-white dark:bg-[#1a1d29] border-r border-slate-300 dark:border-slate-700/50 shadow-xl flex-col z-40 transition-all duration-300",
          isCollapsed ? "w-[80px]" : "w-[260px]"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-[260px] bg-white dark:bg-[#1a1d29] border-r border-slate-300 dark:border-slate-700/50 shadow-xl flex flex-col z-50 lg:hidden transition-transform duration-300',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
