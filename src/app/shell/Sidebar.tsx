import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BookMarked,
  Clock,
  Building2,
  UserCog,
  BarChart3,
  LogOut,
  Library,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@features/auth';
import { cn } from '@shared/utils';
import toast from 'react-hot-toast';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/books', icon: BookOpen, label: 'Books' },
  { to: '/members', icon: Users, label: 'Members', roles: ['Admin', 'Librarian'] },
  { to: '/borrows', icon: BookMarked, label: 'Borrows' },
  { to: '/reservations', icon: Clock, label: 'Reservations' },
  { to: '/branches', icon: Building2, label: 'Branches', roles: ['Admin'] },
  { to: '/users', icon: UserCog, label: 'Users', roles: ['Admin'] },
  { to: '/reports', icon: BarChart3, label: 'Reports', roles: ['Admin', 'Librarian'] },
];

export function Sidebar(): React.ReactElement {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.roles === undefined) return true;
    if (session === null) return false;
    return item.roles.some((r) => session.hasRole(r));
  });

  const handleLogout = async (): Promise<void> => {
    await logout();
    toast.success('Logged out successfully');
    void navigate('/login', { replace: true });
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="h-screen bg-navy-900 flex flex-col shrink-0 overflow-hidden border-r border-navy-800 relative"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-navy-800 shrink-0">
        <div className="p-2 bg-amber-500 rounded-xl shrink-0">
          <Library className="h-5 w-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="text-white font-bold text-base whitespace-nowrap overflow-hidden"
            >
              LibraryMS
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative',
                  isActive
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                    : 'text-navy-400 hover:bg-navy-800 hover:text-navy-100',
                  collapsed && 'justify-center px-2',
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-navy-700 text-navy-100 text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom: User + Logout */}
      <div className="px-2 pb-4 space-y-1 border-t border-navy-800 pt-3">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              isActive ? 'bg-navy-800 text-white' : 'text-navy-400 hover:bg-navy-800 hover:text-navy-100',
              collapsed && 'justify-center px-2',
            )
          }
        >
          <div className="h-7 w-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {session?.username?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0"
              >
                <p className="text-sm font-medium text-navy-200 truncate">{session?.username}</p>
                <p className="text-xs text-navy-500 truncate">{session?.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </NavLink>

        <button
          onClick={() => { void handleLogout(); }}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-navy-400 hover:bg-red-500/10 hover:text-red-400 transition-all',
            collapsed && 'justify-center px-2',
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-20 w-6 h-6 bg-navy-700 border border-navy-600 rounded-full flex items-center justify-center text-navy-300 hover:text-white transition-colors shadow-md z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </motion.aside>
  );
}
