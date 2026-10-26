'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  FolderOpen,
  CheckSquare,
  Image as ImageIcon,
  Search,
  Plus,
  CheckCircle2,
  Edit,
  Check,
  Download,
  Eye,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { mockPeople, mockCategories } from '@/data/mock/people';
import type { PersonCategory } from '@/types';

interface AdminViewProps {
  initialTab?: string;
}

const ADMIN_TAB_ALIASES: Record<string, string> = {
  media: 'content',
  settings: 'overview',
};

const ADMIN_TABS = new Set(['overview', 'profiles', 'categories', 'content', 'claims', 'reports']);

function resolveAdminTab(tab: string) {
  const resolved = ADMIN_TAB_ALIASES[tab] ?? tab;
  return ADMIN_TABS.has(resolved) ? resolved : 'overview';
}

export function AdminView({ initialTab = 'overview' }: AdminViewProps) {
  const [activeTab, setActiveTab] = useState(() => resolveAdminTab(initialTab));
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [categoriesList] = useState(mockCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PersonCategory | 'ALL'>('ALL');

  const [featuredProfiles, setFeaturedProfiles] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    mockPeople.slice(0, 4).forEach((p) => {
      map[p.id] = true;
    });
    return map;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleFeatured = (id: string, name: string) => {
    setFeaturedProfiles((prev) => {
      const next = !prev[id];
      showToast(`Profile "${name}" ${next ? 'pinned to Homepage Featured' : 'unpinned'}.`);
      return { ...prev, [id]: next };
    });
  };

  const filteredPeople = mockPeople.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.professionalTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || p.categories.includes(selectedCategory);
    return matchesSearch && matchesCat;
  });

  return (
    <DashboardLayout requiredRole="ADMIN">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3"
            style={{
              background: '#0F172A',
              border: '1px solid #60A5FA',
              color: '#F8FAFC',
              boxShadow: '0 10px 25px rgba(96, 165, 250, 0.2)',
            }}
          >
            <CheckCircle2 size={18} style={{ color: '#60A5FA' }} />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#60A5FA] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#60A5FA]">
                Administrator Workspace & Content Desk
              </span>
            </div>
            <h1
              className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Profiles & Category Management
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('New profile draft initiated.')}
              className="btn btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              <Plus size={14} /> Add Profile
            </button>
            <button
              onClick={() => showToast('Category directory exported.')}
              className="btn btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              <Download size={14} /> Export Data
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)] mb-2">
              <span>Managed Profiles</span>
              <Users size={16} className="text-[#60A5FA]" />
            </div>
            <div className="text-2xl font-black" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {mockPeople.length}
            </div>
            <div className="text-[11px] text-[#34D399] mt-1 font-medium">
              100% indexed & live
            </div>
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)] mb-2">
              <span>Disciplines</span>
              <FolderOpen size={16} className="text-[#A78BFA]" />
            </div>
            <div className="text-2xl font-black" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {mockCategories.length}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1">
              Active taxonomy fields
            </div>
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)] mb-2">
              <span>Assigned Claims</span>
              <CheckSquare size={16} className="text-[#F59E0B]" />
            </div>
            <div className="text-2xl font-black text-[#F59E0B]" style={{ fontFamily: 'var(--font-display)' }}>
              14
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1">
              Delegated to your queue
            </div>
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)] mb-2">
              <span>Media Assets</span>
              <ImageIcon size={16} className="text-[#C7FF61]" />
            </div>
            <div className="text-2xl font-black" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              452
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1">
              CDN portraits & galleries
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="dashboard-tabs">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'profiles', label: 'People Directory' },
            { id: 'categories', label: 'Categories Taxonomy' },
            { id: 'content', label: 'Spotlight & Bios' },
            { id: 'claims', label: 'Claim Reviews' },
            { id: 'reports', label: 'Analytics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                activeTab === tab.id
                  ? 'bg-[#60A5FA] text-[#0B0D12] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Overview or Profiles */}
        {(activeTab === 'overview' || activeTab === 'profiles' || activeTab === 'content') && (
          <div
            className="p-5 rounded-2xl space-y-4"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search people by name or title..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-[#60A5FA]"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    setSelectedCategory(e.target.value as PersonCategory | 'ALL')
                  }
                  className="px-3 py-2 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-secondary)]"
                >
                  <option value="ALL">All Categories</option>
                  {mockCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-[var(--text-secondary)]">
                Showing {filteredPeople.length} of {mockPeople.length} profiles
              </div>
            </div>

            <div
              className="table-scroll"
              tabIndex={0}
              role="region"
              aria-label="People directory table; scroll horizontally for spotlight and actions"
              data-responsive-table
            >
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] text-[var(--text-tertiary)]">
                    <th className="py-2.5 px-3">Person</th>
                    <th className="py-2.5 px-3">Discipline</th>
                    <th className="py-2.5 px-3">Verification</th>
                    <th className="py-2.5 px-3">Spotlight</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filteredPeople.map((person) => {
                    const isFeat = featuredProfiles[person.id];
                    return (
                      <tr key={person.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                              style={{ background: 'var(--surface-active)', color: 'var(--text-primary)' }}
                            >
                              {person.fullName.slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {person.fullName}
                              </p>
                              <p className="text-[11px] text-[var(--text-secondary)]">
                                {person.professionalTitle}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--surface-active)] text-[var(--text-secondary)]">
                            {person.categories[0] || 'general'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              person.verificationStatus === 'VERIFIED'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : 'bg-amber-500/15 text-amber-400'
                            }`}
                          >
                            {person.verificationStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => toggleFeatured(person.id, person.fullName)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                              isFeat
                                ? 'bg-[#60A5FA]/20 text-[#60A5FA]'
                                : 'bg-[var(--surface-hover)] text-[var(--text-tertiary)]'
                            }`}
                          >
                            {isFeat ? 'Featured' : 'Standard'}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/people/${person.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                              title="Preview"
                            >
                              <Eye size={14} />
                            </Link>
                            <button
                              onClick={() => showToast(`Edit modal opened for ${person.fullName}`)}
                              className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-tertiary)] hover:text-[#60A5FA]"
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Categories */}
        {activeTab === 'categories' && (
          <div
            className="p-5 rounded-2xl space-y-4"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Platform Disciplines & Taxonomy
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Manage field labels, icons, and profile allocation across disciplines.
                </p>
              </div>
              <button
                onClick={() => showToast('New category modal opened.')}
                className="btn btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoriesList.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 rounded-xl flex flex-col justify-between"
                  style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {cat.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-active)] text-[#60A5FA]">
                        {cat.profileCount} profiles
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[var(--text-tertiary)]">/{cat.id}</span>
                    <button
                      onClick={() => showToast(`Edit category "${cat.name}"`)}
                      className="text-xs font-semibold text-[#60A5FA] hover:underline"
                    >
                      Edit Taxonomy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Claims */}
        {activeTab === 'claims' && (
          <div
            className="p-5 rounded-2xl space-y-4"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Assigned Profile Claims Queue
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Claims escalated to Platform Administration for identity verification.
            </p>

            <div className="space-y-3">
              {[
                { name: 'Dr. Elena Rostova', submitter: 'CERN Quantum Dept', proof: 'Official Affiliation Letter', time: '1 hour ago' },
                { name: 'Tariq Mansour', submitter: 'RIBA Legal Registry', proof: 'Architectural License', time: '3 hours ago' },
              ].map((c, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl flex items-center justify-between gap-4"
                  style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}
                >
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      Target: {c.name}
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      Submitted by: {c.submitter} &bull; Proof: {c.proof}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast(`Claim for ${c.name} approved!`)}
                      className="btn btn-primary text-xs px-3 py-1 flex items-center gap-1"
                    >
                      <Check size={13} /> Approve
                    </button>
                    <button
                      onClick={() => showToast(`Revision requested for ${c.name}`)}
                      className="btn btn-secondary text-xs px-3 py-1"
                    >
                      Request Info
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Reports */}
        {activeTab === 'reports' && (
          <div
            className="p-5 rounded-2xl space-y-4"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Discovery Trends & Visitor Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                <p className="text-xs text-[var(--text-secondary)]">Top Viewed Category</p>
                <p className="text-lg font-bold text-[#60A5FA] mt-1">Artists & Musicians</p>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-1">38.4% of total traffic</p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                <p className="text-xs text-[var(--text-secondary)]">Search Conversion Rate</p>
                <p className="text-lg font-bold text-[#34D399] mt-1">74.2%</p>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-1">Direct profile clicks</p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                <p className="text-xs text-[var(--text-secondary)]">Claim Fulfillment Speed</p>
                <p className="text-lg font-bold text-[#C7FF61] mt-1">4.2 hours</p>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-1">Median resolution time</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
