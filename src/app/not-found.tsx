import Link from 'next/link';
import { Compass, Home, Search, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[var(--accent-glow)] rounded-full blur-[160px] pointer-events-none" />

      <div className="container-mova max-w-xl text-center relative z-10">
        {/* Kinetic Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] text-[var(--accent-primary)] text-caption font-mono uppercase tracking-wider mb-6">
          Error 404
        </div>

        <h1
          className="text-7xl md:text-9xl font-extrabold tracking-tighter text-[var(--text-primary)] mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          4<span className="text-[var(--accent-primary)]">0</span>4
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4">
          This Story Has Not Been Written Yet
        </h2>

        <p className="text-body-md text-[var(--text-secondary)] mb-8 leading-relaxed">
          The page or person profile you are searching for might have been relocated, unlisted, or does not exist in our directory.
        </p>

        {/* Quick Search */}
        <div className="mb-8">
          <form
            action="/explore"
            method="get"
            className="flex items-center gap-2 max-w-md mx-auto p-1.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] focus-within:border-[var(--accent-primary)] transition-colors shadow-lg"
          >
            <Search size={18} className="text-[var(--text-tertiary)] ml-3" />
            <input
              type="text"
              name="q"
              placeholder="Search people by name, skill, or role..."
              className="flex-1 bg-transparent py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
            />
            <button type="submit" className="btn btn-primary text-xs py-2 px-4">
              Search
            </button>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn btn-primary">
            <Home size={16} />
            Return Home
          </Link>
          <Link href="/explore" className="btn btn-secondary">
            <Compass size={16} />
            Explore People
          </Link>
          <Link href="/categories" className="btn btn-ghost text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            Browse Categories
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
