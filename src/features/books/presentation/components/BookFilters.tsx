import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@shared/ui';
import type { BookMetadata } from '../../application/use-cases/get-metadata.use-case';

export interface BookFiltersState {
  searchTerm: string;
  categoryId: string;
  authorId: string;
}

interface BookFiltersProps {
  filters: BookFiltersState;
  metadata: BookMetadata | undefined;
  isLoadingMetadata: boolean;
  onFilterChange: (filters: BookFiltersState) => void;
}

export function BookFilters({ filters, metadata, isLoadingMetadata, onFilterChange }: BookFiltersProps): React.ReactElement {
  const [localSearch, setLocalSearch] = React.useState(filters.searchTerm);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.searchTerm) {
        onFilterChange({ ...filters, searchTerm: localSearch });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, filters, onFilterChange]);

  const handleClear = () => {
    setLocalSearch('');
    onFilterChange({ searchTerm: '', categoryId: '', authorId: '' });
  };

  const hasActiveFilters = filters.searchTerm !== '' || filters.categoryId !== '' || filters.authorId !== '';

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 items-center">
      <div className="flex-1 w-full relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search books by title, ISBN, or publisher..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
        />
      </div>

      <div className="flex gap-3 w-full sm:w-auto">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            value={filters.categoryId}
            onChange={(e) => onFilterChange({ ...filters, categoryId: e.target.value })}
            className="h-10 pl-9 pr-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer min-w-[140px]"
            disabled={isLoadingMetadata}
          >
            <option value="">All Categories</option>
            {metadata?.categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            value={filters.authorId}
            onChange={(e) => onFilterChange({ ...filters, authorId: e.target.value })}
            className="h-10 pl-9 pr-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer min-w-[140px]"
            disabled={isLoadingMetadata}
          >
            <option value="">All Authors</option>
            {metadata?.authors.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={handleClear} className="h-10 px-3 text-slate-500 border-slate-200 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Simple fallback icon since User isn't imported from lucide-react above
function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
