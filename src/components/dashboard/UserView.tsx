'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Bookmark,
  History,
  FolderOpen,
  Sliders,
  User,
  CheckCircle2,
  ExternalLink,
  Trash2,
  Search,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Heart,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { mockPeople } from '@/data/mock/people';

interface UserViewProps {
  initialTab?: string;
}

export function UserView({ initialTab = 'overview' }: UserViewProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Saved profiles state
  const [savedPeople, setSavedPeople] = useState(() => mockPeople.slice(0, 5));
  const [recentPeople, setRecentPeople] = useState(() => mockPeople.slice(2, 6));

  const [feedPreference, setFeedPreference] = useState<'trending' | 'curated' | 'recent'>('curated');
  const [emailDigest, setEmailDigest] = useState(true);

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('mova_user_saved_people');
        if (stored) {
          const ids: string[] = JSON.parse(stored);
          const matched = mockPeople.filter((p) => ids.includes(p.id));
          if (matched.length > 0) {
            setSavedPeople(matched);
          }
        }
      } catch {}
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRemoveSaved = (id: string, name: string) => {
    setSavedPeople((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('mova_user_saved_people', JSON.stringify(updated.map((p) => p.id)));
        } catch {}
      }
      return updated;
    });
    showToast(`"${name}" removed from saved collection.`);
  };

  return (
    <DashboardLayout requiredRole="USER">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3"
            style={{
              background: '#0F172A',
              border: '1px solid #34D399',
              color: '#F8FAFC',
              boxShadow: '0 10px 25px rgba(52, 211, 153, 0.2)',
            }}
          >
            <CheckCircle2 size={18} style={{ color: '#34D399' }} />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#34D399]">
                Explorer Personal Portal
              </span>
            </div>
            <h1
              className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Sam Rivera &bull; Discovery & Saved
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/explore"
              className="btn btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              <Compass size={14} /> Explore People
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)] mb-2">
              <span>Saved Profiles</span>
              <Bookmark size={16} className="text-[#34D399]" />
            </div>
            <div className="text-2xl font-black text-[#34D399]" style={{ fontFamily: 'var(--font-display)' }}>
              {savedPeople.length}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1">
              In your personal collection
            </div>
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)] mb-2">
              <span>Viewed This Week</span>
              <History size={16} className="text-[#60A5FA]" />
            </div>
            <div className="text-2xl font-black" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              38
            </div>
            <div className="text-[11px] text-[#34D399] mt-1 font-medium">
              <TrendingUp size={12} className="inline mr-0.5" /> Active discovery
            </div>
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)] mb-2">
              <span>Disciplines Followed</span>
              <FolderOpen size={16} className="text-[#A78BFA]" />
            </div>
            <div className="text-2xl font-black text-[#A78BFA]" style={{ fontFamily: 'var(--font-display)' }}>
              3
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1">
              Music, Physics, Architecture
            </div>
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)] mb-2">
              <span>Member Since</span>
              <User size={16} className="text-[#C7FF61]" />
            </div>
            <div className="text-2xl font-black" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              Jan 2024
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1">
              Explorer Tier
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[var(--border-subtle)]">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'saved', label: `Saved Profiles (${savedPeople.length})` },
            { id: 'recent', label: 'Recently Viewed' },
            { id: 'preferences', label: 'Discovery Preferences' },
            { id: 'account', label: 'Account Profile' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                activeTab === tab.id
                  ? 'bg-[#34D399] text-[#0B0D12] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: Overview / Saved */}
        {(activeTab === 'overview' || activeTab === 'saved') && (
          <div
            className="p-5 rounded-2xl space-y-4"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Saved Profiles & Creators
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  People you have bookmarked for future reference and updates.
                </p>
              </div>

              <Link
                href="/explore"
                className="text-xs text-[#34D399] hover:underline font-semibold flex items-center gap-1"
              >
                Find More Creators <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {savedPeople.map((person) => (
                <div
                  key={person.id}
                  className="p-4 rounded-xl flex items-center justify-between gap-3 group"
                  style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                      style={{ background: 'var(--surface-active)', color: 'var(--text-primary)' }}
                    >
                      {person.fullName.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                          {person.fullName}
                        </p>
                        {person.verificationStatus === 'VERIFIED' && (
                          <CheckCircle2 size={13} className="text-[#34D399] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] truncate">
                        {person.professionalTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/people/${person.slug}`}
                      className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                      title="View Profile"
                    >
                      <ExternalLink size={14} />
                    </Link>
                    <button
                      onClick={() => handleRemoveSaved(person.id, person.fullName)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove Bookmark"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {savedPeople.length === 0 && (
                <div className="col-span-2 py-8 text-center text-xs text-[var(--text-tertiary)]">
                  Your saved collection is empty. Explore creators and click bookmark to save them!
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: RECENT */}
        {activeTab === 'recent' && (
          <div
            className="p-5 rounded-2xl space-y-4"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Recently Viewed Creators
            </h3>
            <div className="divide-y divide-[var(--border-subtle)]">
              {recentPeople.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between">
                  <div>
                    <Link
                      href={`/people/${p.slug}`}
                      className="text-xs font-bold hover:underline"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {p.fullName}
                    </Link>
                    <p className="text-[11px] text-[var(--text-secondary)]">{p.professionalTitle}</p>
                  </div>
                  <Link
                    href={`/people/${p.slug}`}
                    className="text-xs text-[#34D399] hover:underline"
                  >
                    View &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PREFERENCES */}
        {activeTab === 'preferences' && (
          <div
            className="p-5 rounded-2xl space-y-5 max-w-xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                Discovery Feed Preferences
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Customize how creators are recommended on your homepage and explore feed.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Feed Ranking Algorithm
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'curated', label: 'Curated by MOVA Editorial' },
                    { id: 'trending', label: 'Trending & High-Activity' },
                    { id: 'recent', label: 'Recently Added Profiles' },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="feed"
                        checked={feedPreference === opt.id}
                        onChange={() => setFeedPreference(opt.id as any)}
                        className="accent-[#34D399]"
                      />
                      <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Weekly Discovery Email Digest
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Receive highlighted creators matching your interests.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEmailDigest(!emailDigest);
                    showToast(`Email digest ${!emailDigest ? 'ENABLED' : 'PAUSED'}`);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    emailDigest ? 'bg-[#34D399]' : 'bg-[var(--surface-active)]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-[#0B0D12] transition-transform ${
                      emailDigest ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <button
                onClick={() => showToast('Preferences updated successfully!')}
                className="btn btn-primary text-xs px-4 py-2"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* TAB: ACCOUNT */}
        {activeTab === 'account' && (
          <div
            className="p-5 rounded-2xl space-y-4 max-w-xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Account Information
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">Account Name</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Sam Rivera</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">Email</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>user@mova.demo</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">Role</span>
                <span className="font-semibold text-[#34D399]">Platform Explorer</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
