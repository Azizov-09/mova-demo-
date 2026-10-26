'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Grid3X3,
  List,
  X,
  CheckCircle,
  ChevronDown,
  Filter,
} from 'lucide-react';
import { PersonCard } from '@/components/people/PersonCard';
import { mockPeople, mockCategories } from '@/data/mock/people';
import type { SearchFilters, Person, PersonCategory } from '@/types';
import { cn } from '@/lib/utils';

const categoryNames: Record<PersonCategory, string> = {
  'artists-musicians': 'Artists & Musicians',
  'actors-public-figures': 'Actors & Public Figures',
  'bloggers-creators': 'Bloggers & Creators',
  'athletes': 'Athletes',
  'entrepreneurs': 'Entrepreneurs',
  'developers': 'Developers',
  'scientists-experts': 'Scientists & Experts',
  'business-leaders': 'Business Leaders',
  'other-professionals': 'Other Professionals',
};

function filterPeople(people: Person[], filters: SearchFilters): Person[] {
  let results = [...people];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      p =>
        p.fullName.toLowerCase().includes(q) ||
        p.professionalTitle.toLowerCase().includes(q) ||
        p.shortBio.toLowerCase().includes(q) ||
        p.publicLocation?.toLowerCase().includes(q),
    );
  }

  if (filters.categories && filters.categories.length > 0) {
    results = results.filter(p =>
      filters.categories!.some(cat => p.categories.includes(cat)),
    );
  }

  if (filters.verifiedOnly) {
    results = results.filter(p => p.verificationStatus === 'VERIFIED');
  }

  switch (filters.sortBy) {
    case 'name':
      results.sort((a, b) => a.fullName.localeCompare(b.fullName));
      break;
    case 'updated':
      results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      break;
    default:
      results.sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
  }

  return results;
}

export default function ExploreClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [selectedCategories, setSelectedCategories] = useState<PersonCategory[]>(() => {
    const cat = searchParams.get('category') as PersonCategory | null;
    return cat ? [cat] : [];
  });
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'updated'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filters: SearchFilters = {
    query: query || undefined,
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    verifiedOnly,
    sortBy,
  };

  const results = filterPeople(mockPeople, filters);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedCategories.length === 1) params.set('category', selectedCategories[0]);
    if (verifiedOnly) params.set('verified', '1');
    if (sortBy !== 'featured') params.set('sort', sortBy);

    const newSearch = params.toString();
    const currentSearch = searchParams.toString();
    if (newSearch !== currentSearch) {
      router.replace(`/explore${newSearch ? `?${newSearch}` : ''}`, { scroll: false });
    }
  }, [query, selectedCategories, verifiedOnly, sortBy, router, searchParams]);

  const toggleCategory = (cat: PersonCategory) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat],
    );
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCategories([]);
    setVerifiedOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters = !!(
    query || selectedCategories.length > 0 || verifiedOnly || sortBy !== 'featured'
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Page Header */}
      <div className="border-b border-[var(--border-subtle)]" style={{ background: 'var(--bg-elevated)' }}>
        <div className="container-mova py-10">
          <h1 className="text-display-lg mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Explore People
          </h1>
          <p className="text-body-md text-[var(--text-secondary)]">
            {results.length} profile{results.length !== 1 ? 's' : ''} found
            {query && (
              <span>
                {' '}for <strong className="text-[var(--text-primary)]">&ldquo;{query}&rdquo;</strong>
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="container-mova py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0" aria-label="Filters">
            <FilterPanel
              query={query} setQuery={setQuery}
              selectedCategories={selectedCategories} toggleCategory={toggleCategory}
              verifiedOnly={verifiedOnly} setVerifiedOnly={setVerifiedOnly}
              sortBy={sortBy} setSortBy={setSortBy}
              clearFilters={clearFilters} hasActiveFilters={hasActiveFilters}
              searchRef={searchRef}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Controls */}
            <div className="lg:hidden mb-6 space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
                <input
                  type="search" placeholder="Search people..."
                  value={query} onChange={e => setQuery(e.target.value)}
                  className="input-mova pl-10"
                />
              </div>
              <button
                onClick={() => setIsFilterOpen(true)}
                className={cn('btn btn-secondary w-full', hasActiveFilters && 'border-[var(--accent-primary)] text-[var(--accent-primary)]')}
              >
                <Filter size={14} />
                Filters
                {hasActiveFilters && <span className="badge badge-accent ml-auto">Active</span>}
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-body-sm text-[var(--text-secondary)] hidden sm:block">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-2 ml-auto">
                <div className="flex items-center rounded-lg border border-[var(--border-default)] overflow-hidden" role="group" aria-label="View mode">
                  {(['grid', 'list'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={cn('p-2 transition-colors', viewMode === mode ? 'bg-[var(--accent-dim)] text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]')}
                      aria-pressed={viewMode === mode}
                      aria-label={`${mode} view`}
                    >
                      {mode === 'grid' ? <Grid3X3 size={16} /> : <List size={16} />}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as typeof sortBy)}
                    className="input-mova text-sm appearance-none cursor-pointer"
                    style={{ width: 'auto', paddingRight: '32px' }}
                    aria-label="Sort results"
                  >
                    <option value="featured">Featured</option>
                    <option value="name">Name (A–Z)</option>
                    <option value="updated">Recently Updated</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-tertiary)' }} />
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {query && <FilterChip label={`"${query}"`} onRemove={() => setQuery('')} />}
                {selectedCategories.map(cat => (
                  <FilterChip key={cat} label={categoryNames[cat]} onRemove={() => toggleCategory(cat)} />
                ))}
                {verifiedOnly && <FilterChip label="Verified only" onRemove={() => setVerifiedOnly(false)} />}
                <button onClick={clearFilters} className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors px-2 py-1">
                  Clear all
                </button>
              </div>
            )}

            {/* Results */}
            <AnimatePresence mode="wait">
              {results.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--bg-elevated)' }}>
                    <Search size={24} style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                  <h2 className="text-h3 mb-2" style={{ fontFamily: 'var(--font-display)' }}>No profiles found</h2>
                  <p className="text-body-sm text-[var(--text-secondary)] max-w-sm mb-6">
                    Try adjusting your search or filters to find what you&apos;re looking for.
                  </p>
                  <button onClick={clearFilters} className="btn btn-secondary">Clear Filters</button>
                </motion.div>
              ) : (
                <motion.div
                  key={`${viewMode}-results`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-3'}
                >
                  {results.map((person, i) => (
                    <PersonCard key={person.id} person={person} variant={viewMode === 'list' ? 'compact' : 'default'} index={i} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(0,0,0,0.6)' }}
              onClick={() => setIsFilterOpen(false)} />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl max-h-[85vh] flex flex-col lg:hidden"
              style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-subtle)' }}
              role="dialog" aria-label="Filters" aria-modal="true"
            >
              <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)]">
                <h2 className="font-bold text-base" style={{ fontFamily: 'var(--font-display)' }}>Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="btn btn-ghost p-2" aria-label="Close filters">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <FilterPanel
                  query={query} setQuery={setQuery}
                  selectedCategories={selectedCategories} toggleCategory={toggleCategory}
                  verifiedOnly={verifiedOnly} setVerifiedOnly={setVerifiedOnly}
                  sortBy={sortBy} setSortBy={setSortBy}
                  clearFilters={clearFilters} hasActiveFilters={hasActiveFilters}
                  searchRef={searchRef}
                />
              </div>
              <div className="p-5 border-t border-[var(--border-subtle)]">
                <button onClick={() => setIsFilterOpen(false)} className="btn btn-primary w-full">
                  Show {results.length} Result{results.length !== 1 ? 's' : ''}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterPanel({
  query, setQuery, selectedCategories, toggleCategory,
  verifiedOnly, setVerifiedOnly, sortBy, setSortBy,
  clearFilters, hasActiveFilters, searchRef,
}: {
  query: string; setQuery: (q: string) => void;
  selectedCategories: PersonCategory[]; toggleCategory: (cat: PersonCategory) => void;
  verifiedOnly: boolean; setVerifiedOnly: (v: boolean) => void;
  sortBy: string; setSortBy: (s: 'featured' | 'name' | 'updated') => void;
  clearFilters: () => void; hasActiveFilters: boolean;
  searchRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-eyebrow mb-3">Search</p>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
          <input
            ref={searchRef} type="search" placeholder="Search name, title, location..."
            value={query} onChange={e => setQuery(e.target.value)}
            className="input-mova pl-9 text-sm"
          />
        </div>
      </div>
      <div>
        <p className="text-eyebrow mb-3">Categories</p>
        <div className="space-y-1.5">
          {mockCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 text-left',
                selectedCategories.includes(cat.id)
                  ? 'bg-[var(--accent-dim)] text-[var(--accent-primary)] font-medium'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
              )}
              aria-pressed={selectedCategories.includes(cat.id)}
            >
              <span className="flex-1 truncate">{cat.name}</span>
              <span className="text-xs opacity-60">{cat.profileCount}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-eyebrow mb-3">Verification</p>
        <button
          onClick={() => setVerifiedOnly(!verifiedOnly)}
          className={cn(
            'flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm w-full transition-all duration-150',
            verifiedOnly ? 'bg-[rgba(34,197,94,0.12)] text-[#22c55e]' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
          )}
          aria-pressed={verifiedOnly}
        >
          <CheckCircle size={14} />
          Verified Profiles Only
        </button>
      </div>
      <div>
        <label className="text-eyebrow block mb-3" htmlFor="sort-select">Sort By</label>
        <div className="relative">
          <select
            id="sort-select" value={sortBy}
            onChange={e => setSortBy(e.target.value as 'featured' | 'name' | 'updated')}
            className="input-mova text-sm appearance-none cursor-pointer" style={{ paddingRight: '32px' }}
          >
            <option value="featured">Featured</option>
            <option value="name">Name (A–Z)</option>
            <option value="updated">Recently Updated</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-tertiary)' }} />
        </div>
      </div>
      {hasActiveFilters && (
        <button onClick={clearFilters} className="btn btn-ghost w-full text-sm text-[var(--text-tertiary)]">
          <X size={14} /> Clear all filters
        </button>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border-default)] bg-[var(--bg-elevated)] text-xs text-[var(--text-secondary)]"
    >
      <span>{label}</span>
      <button onClick={onRemove} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors" aria-label={`Remove filter: ${label}`}>
        <X size={12} />
      </button>
    </motion.div>
  );
}
