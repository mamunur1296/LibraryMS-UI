import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@features/auth';
import { Badge } from '@shared/ui';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/books': 'Books',
  '/members': 'Members',
  '/borrows': 'Borrows',
  '/reservations': 'Reservations',
  '/branches': 'Branches',
  '/users': 'User Management',
  '/reports': 'Reports',
  '/profile': 'Profile & Settings',
};

export function Topbar({ onMenuToggle }: { onMenuToggle: () => void }): React.ReactElement {
  const location = useLocation();
  const { session } = useAuth();
  const title = PAGE_TITLES[location.pathname] ?? 'LibraryMS';

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm relative z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg md:hidden transition-colors"
          aria-label="Open menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <p className="text-xs text-slate-400 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search — placeholder, to be wired later */}
        <button
          className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 text-sm hover:bg-slate-100 transition-colors"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
          <span>Search...</span>
          <kbd className="text-xs bg-white border border-slate-200 rounded px-1.5 py-0.5">⌘K</kbd>
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
            {session?.username?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-700 leading-tight">{session?.username}</p>
            <Badge variant={session?.isAdmin() === true ? 'primary' : 'neutral'} className="text-xs">
              {session?.role ?? 'User'}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
