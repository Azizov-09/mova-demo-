'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CheckSquare,
  Filter,
  UserX,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

interface ModeratorViewProps {
  initialTab?: string;
}

const MODERATOR_TABS = new Set(['overview', 'pending', 'reported', 'content', 'history']);

function resolveModeratorTab(tab: string) {
  return MODERATOR_TABS.has(tab) ? tab : 'overview';
}

interface ModerationItem {
  id: string;
  targetType: 'PROFILE' | 'BIOGRAPHY' | 'GALLERY' | 'CLAIM';
  targetName: string;
  reporter: string;
  reason: 'IMPERSONATION' | 'FALSE_CLAIM' | 'COPYRIGHT' | 'SPAM';
  severity: 'URGENT' | 'HIGH' | 'MEDIUM';
  details: string;
  timeAgo: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
}

const INITIAL_MODERATION_QUEUE: ModerationItem[] = [
  {
    id: 'mod-1',
    targetType: 'PROFILE',
    targetName: 'Marcus Sterling (VC Impersonator)',
    reporter: 'Hyperion Capital Compliance',
    reason: 'IMPERSONATION',
    severity: 'URGENT',
    details: 'User claims to be General Partner at Hyperion Capital without authorization.',
    timeAgo: '12m ago',
    status: 'PENDING',
  },
  {
    id: 'mod-2',
    targetType: 'BIOGRAPHY',
    targetName: 'Devon Vance Art Showcase',
    reporter: 'Gallery 404 Venice',
    reason: 'COPYRIGHT',
    severity: 'HIGH',
    details: 'High-res image in gallery belongs to copyrighted Biennale catalog without attribution.',
    timeAgo: '45m ago',
    status: 'PENDING',
  },
  {
    id: 'mod-3',
    targetType: 'BIOGRAPHY',
    targetName: 'Crypto Whisperer Profile',
    reporter: 'Community Flag (x8)',
    reason: 'SPAM',
    severity: 'MEDIUM',
    details: 'Biography contains repetitive external links promoting unauthorized token sales.',
    timeAgo: '2h ago',
    status: 'PENDING',
  },
  {
    id: 'mod-4',
    targetType: 'CLAIM',
    targetName: 'Tariq Mansour Architecture',
    reporter: 'Duplicate Submitter',
    reason: 'FALSE_CLAIM',
    severity: 'HIGH',
    details: 'Conflicting passport upload with different national ID number.',
    timeAgo: '3h ago',
    status: 'PENDING',
  },
];

export function ModeratorView({ initialTab = 'overview' }: ModeratorViewProps) {
  const [activeTab, setActiveTab] = useState(() => resolveModeratorTab(initialTab));
  const [items, setItems] = useState<ModerationItem[]>(INITIAL_MODERATION_QUEUE);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedReasonFilter, setSelectedReasonFilter] = useState('ALL');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResolve = (id: string, action: 'RESOLVED' | 'DISMISSED', note: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );
    showToast(`Case ${id}: ${action} (${note})`);
  };

  const pendingItems = items.filter((i) => i.status === 'PENDING');
  const filteredItems = pendingItems.filter(
    (i) => selectedReasonFilter === 'ALL' || i.reason === selectedReasonFilter
  );

  return (
    <DashboardLayout requiredRole="MODERATOR">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3"
            style={{
              background: '#0F172A',
              border: '1px solid #F59E0B',
              color: '#F8FAFC',
              boxShadow: '0 10px 25px rgba(245, 158, 11, 0.2)',
            }}
          >
            <CheckCircle2 size={18} style={{ color: '#F59E0B' }} />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#F59E0B]">
                Trust & Safety &bull; Content Moderation Queue
              </span>
            </div>
            <h1
              className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Moderation Desk & Flagged Content
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('All pending filters refreshed.')}
              className="btn btn-secondary text-xs px-3.5 py-2"
            >
              Refresh Queue
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
              <span>Pending Flags</span>
              <AlertTriangle size={16} className="text-[#F59E0B]" />
            </div>
            <div className="text-2xl font-black text-[#F59E0B]" style={{ fontFamily: 'var(--font-display)' }}>
              {pendingItems.length}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1">
              Active incident tickets
            </div>
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)] mb-2">
              <span>Reviewed Today</span>
              <CheckSquare size={16} className="text-[#34D399]" />
            </div>
            <div className="text-2xl font-black text-[#34D399]" style={{ fontFamily: 'var(--font-display)' }}>
              48
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1">
              Resolved or cleared
            </div>
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)] mb-2">
              <span>Avg Turnaround</span>
              <Clock size={16} className="text-[#60A5FA]" />
            </div>
            <div className="text-2xl font-black" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              4.2m
            </div>
            <div className="text-[11px] text-[#34D399] mt-1">
              Above SLA threshold
            </div>
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)] mb-2">
              <span>Safety Rating</span>
              <ShieldAlert size={16} className="text-[#C7FF61]" />
            </div>
            <div className="text-2xl font-black text-[#C7FF61]" style={{ fontFamily: 'var(--font-display)' }}>
              99.2%
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1">
              Platform compliance
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="dashboard-tabs">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'pending', label: `Pending Queue (${pendingItems.length})` },
            { id: 'reported', label: 'Reported Profiles' },
            { id: 'content', label: 'Bio & Claims Inspector' },
            { id: 'history', label: 'Moderation History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                activeTab === tab.id
                  ? 'bg-[#F59E0B] text-[#0B0D12] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div
          className="p-5 rounded-2xl space-y-4"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                {activeTab === 'history' ? 'Resolved Moderation Decisions' : 'Priority Incident Reports'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                {activeTab === 'history'
                  ? 'Logged decisions taken by moderation staff.'
                  : 'Items reported by the community or automated compliance checks.'}
              </p>
            </div>

            {activeTab !== 'history' && (
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-[var(--text-tertiary)]" />
                <select
                  value={selectedReasonFilter}
                  onChange={(e) => setSelectedReasonFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-secondary)]"
                >
                  <option value="ALL">All Reasons</option>
                  <option value="IMPERSONATION">Impersonation</option>
                  <option value="FALSE_CLAIM">False Claim</option>
                  <option value="COPYRIGHT">Copyright</option>
                  <option value="SPAM">Spam</option>
                </select>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {(activeTab === 'history' ? items.filter((i) => i.status !== 'PENDING') : filteredItems).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                style={{
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-black tracking-wider ${
                        item.severity === 'URGENT'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : item.severity === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {item.severity}
                    </span>
                    <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                      {item.targetName}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-active)] text-[var(--text-secondary)]">
                      {item.reason}
                    </span>
                    <span className="text-[11px] text-[var(--text-tertiary)]">&bull; {item.timeAgo}</span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {item.details}
                  </p>

                  <p className="text-[11px] text-[var(--text-tertiary)]">
                    Reported by: <span className="text-[var(--text-secondary)]">{item.reporter}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => handleResolve(item.id, 'RESOLVED', 'Enforced warning & profile hidden')}
                        className="btn btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
                      >
                        <UserX size={13} /> Enforce Action
                      </button>
                      <button
                        onClick={() => handleResolve(item.id, 'DISMISSED', 'Verified authentic')}
                        className="btn btn-secondary text-xs px-3 py-1.5 text-emerald-400 hover:text-emerald-300"
                      >
                        Dismiss Report
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[var(--surface-active)] text-[var(--text-secondary)]">
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && activeTab !== 'history' && (
              <div className="py-12 text-center text-xs text-[var(--text-tertiary)]">
                <CheckCircle2 size={32} className="mx-auto text-[#34D399] mb-2" />
                All clear! No pending items matching the selected criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
