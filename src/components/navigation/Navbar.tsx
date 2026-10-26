'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Menu,
  X,
  Sun,
  Moon,
  Compass,
  Users,
  Info,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/categories', label: 'Categories', icon: Users },
  { href: '/about', label: 'About', icon: Info },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Track scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load theme
  useEffect(() => {
    const stored = localStorage.getItem('mova-theme') as 'dark' | 'light' | null;
    if (!stored) return;

    const frame = window.requestAnimationFrame(() => setTheme(stored));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('mova-theme', newTheme);
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* Main Navbar */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-[var(--bg-overlay)] backdrop-blur-xl border-b border-[var(--border-subtle)] shadow-[var(--mova-shadow-sm)]'
            : 'bg-transparent'
        )}
        style={{ height: 'var(--nav-height)' }}
      >
        <div className="container-mova h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 group"
            aria-label="MOVA — Home"
          >
            <motion.div
              className="relative w-8 h-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: -3 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className="font-display font-black text-sm leading-none"
                style={{ color: '#0B0D12', fontFamily: 'var(--font-display)' }}
              >
                M
              </span>
            </motion.div>
            <span
              className="text-xl font-black tracking-tight hidden sm:block"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              MOVA
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative px-4 py-2 rounded-lg text-label transition-all duration-200',
                  isActive(href)
                    ? 'text-[var(--text-primary)] bg-[var(--surface-active)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                )}
              >
                {isActive(href) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-[var(--surface-active)]"
                    transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ zIndex: -1 }}
                  />
                )}
                {label}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={cn(
                'hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-default)]',
                'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:border-[var(--border-strong)]',
                'transition-all duration-200 text-sm'
              )}
              aria-label="Open search"
            >
              <Search size={14} />
              <span className="hidden lg:inline text-xs">Search</span>
              <kbd className="hidden lg:inline text-xs px-1.5 py-0.5 rounded bg-[var(--surface-hover)] border border-[var(--border-subtle)] font-mono text-[10px]">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden btn btn-ghost p-2"
              aria-label="Open search"
            >
              <Search size={18} />
            </button>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="btn btn-ghost p-2 rounded-lg"
              whileTap={{ scale: 0.9 }}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={18} style={{ color: 'var(--text-secondary)' }} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={18} style={{ color: 'var(--text-secondary)' }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* CTA */}
            <Link
              href="/login"
              className="hidden sm:flex btn btn-primary text-sm px-4 py-2"
            >
              Sign In
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileOpen(prev => !prev)}
              className="md:hidden btn btn-ghost p-2"
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={20} style={{ color: 'var(--text-primary)' }} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu size={20} style={{ color: 'var(--text-primary)' }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-[var(--bg-base)]/80 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-[var(--bg-elevated)] border-l border-[var(--border-subtle)] md:hidden flex flex-col"
              role="dialog"
              aria-label="Mobile navigation menu"
              aria-modal="true"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)]">
                <span className="text-h3" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="btn btn-ghost p-2"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Links */}
              <nav className="flex-1 p-5 space-y-2" aria-label="Mobile navigation">
                {navLinks.map(({ href, label, icon: Icon }, index) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 + 0.1, duration: 0.25 }}
                  >
                    <Link
                      href={href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                        isActive(href)
                          ? 'bg-[var(--accent-dim)] text-[var(--accent-primary)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                      )}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{label}</span>
                      {isActive(href) && <ArrowRight size={14} className="ml-auto" />}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile Bottom */}
              <div className="p-5 border-t border-[var(--border-subtle)] space-y-3">
                <Link
                  href="/login"
                  className="btn btn-primary w-full"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/claim"
                  className="btn btn-secondary w-full"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Claim Profile
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Dialog */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-60 bg-[var(--bg-base)]/85 backdrop-blur-md"
              onClick={() => setIsSearchOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1.0] }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-60 w-full max-w-lg mx-4"
              role="dialog"
              aria-label="Search"
              aria-modal="true"
            >
              <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-2xl overflow-hidden shadow-[var(--mova-shadow-lg)]">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border-subtle)]">
                  <Search size={18} style={{ color: 'var(--text-tertiary)' }} />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search people, categories..."
                    className="flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none text-base"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = e.currentTarget.value.trim();
                        if (val) {
                          setIsSearchOpen(false);
                          router.push(`/explore?q=${encodeURIComponent(val)}`);
                        }
                      }
                      if (e.key === 'Escape') setIsSearchOpen(false);
                    }}
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="btn btn-ghost text-xs px-2 py-1 font-mono"
                  >
                    Esc
                  </button>
                </div>

                {/* Quick Links */}
                <div className="p-4">
                  <p className="text-eyebrow mb-3">Quick explore</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Artists & Musicians', href: '/explore?category=artists-musicians' },
                      { label: 'Entrepreneurs', href: '/explore?category=entrepreneurs' },
                      { label: 'Developers', href: '/explore?category=developers' },
                      { label: 'Scientists', href: '/explore?category=scientists-experts' },
                    ].map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[var(--surface-hover)] hover:bg-[var(--accent-dim)] transition-colors duration-150 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)]"
                      >
                        <ArrowRight size={12} />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
