'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Search,
  Download,
  Plus,
  RefreshCw,
  Server,
  Check,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { mockPeople } from '@/data/mock/people';

interface SuperAdminViewProps {
  initialTab?: string;
}

const SUPER_ADMIN_TAB_ALIASES: Record<string, string> = {
  categories: 'profiles',
  moderation: 'claims',
  reports: 'audit',
};

const SUPER_ADMIN_TABS = new Set([
  'overview',
  'users',
  'claims',
  'profiles',
  'roles',
  'settings',
  'audit',
]);

function resolveSuperAdminTab(tab: string) {
  const resolved = SUPER_ADMIN_TAB_ALIASES[tab] ?? tab;
  return SUPER_ADMIN_TABS.has(resolved) ? resolved : 'overview';
}

// Mock initial data
interface DemoUserRow {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'CREATOR' | 'USER';
  status: 'ACTIVE' | 'SUSPENDED';
  joinedDate: string;
  avatarColor: string;
}

const INITIAL_USERS: DemoUserRow[] = [
  { id: 'usr-1', name: 'Alex Karimov', email: 'alex@mova.demo', role: 'SUPER_ADMIN', status: 'ACTIVE', joinedDate: '2023-01-10', avatarColor: '#C7FF61' },
  { id: 'usr-2', name: 'Sofia Marchetti', email: 'sofia@mova.demo', role: 'ADMIN', status: 'ACTIVE', joinedDate: '2023-03-15', avatarColor: '#60A5FA' },
  { id: 'usr-3', name: 'James Okafor', email: 'james@mova.demo', role: 'MODERATOR', status: 'ACTIVE', joinedDate: '2023-06-01', avatarColor: '#F59E0B' },
  { id: 'usr-4', name: 'Aiko Nakamura', email: 'aiko@mova.demo', role: 'CREATOR', status: 'ACTIVE', joinedDate: '2022-09-01', avatarColor: '#A78BFA' },
  { id: 'usr-5', name: 'Sam Rivera', email: 'sam@mova.demo', role: 'USER', status: 'ACTIVE', joinedDate: '2024-01-10', avatarColor: '#34D399' },
  { id: 'usr-6', name: 'Elena Rostova', email: 'elena.rostova@quantum.org', role: 'CREATOR', status: 'ACTIVE', joinedDate: '2023-04-12', avatarColor: '#EC4899' },
  { id: 'usr-7', name: 'Tariq Mansour', email: 'tariq@mansour.arch', role: 'CREATOR', status: 'ACTIVE', joinedDate: '2023-07-22', avatarColor: '#38BDF8' },
  { id: 'usr-8', name: 'Marcus Sterling', email: 'marcus@hyperion.vc', role: 'USER', status: 'SUSPENDED', joinedDate: '2023-11-05', avatarColor: '#EF4444' },
];

interface ClaimRow {
  id: string;
  profileName: string;
  claimantName: string;
  claimantEmail: string;
  proofDocument: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const INITIAL_CLAIMS: ClaimRow[] = [
  { id: 'clm-1', profileName: 'Aiko Nakamura', claimantName: 'Aiko Nakamura (Artist Mgmt)', claimantEmail: 'mgmt@aiko-nakamura.jp', proofDocument: 'Passport & Agency Contract.pdf', submittedAt: '10 mins ago', status: 'PENDING' },
  { id: 'clm-2', profileName: 'Elena Rostova', claimantName: 'Dr. Elena Rostova', claimantEmail: 'rostova@cern.ch', proofDocument: 'Institutional ID & ORCID verification.pdf', submittedAt: '2 hours ago', status: 'PENDING' },
  { id: 'clm-3', profileName: 'Tariq Mansour', claimantName: 'Studio Mansour Legal', claimantEmail: 'legal@mansour-arch.com', proofDocument: 'RIBA Certificate.pdf', submittedAt: '1 day ago', status: 'PENDING' },
  { id: 'clm-4', profileName: 'Devon Vance', claimantName: 'Devon Vance', claimantEmail: 'devon@vance-art.com', proofDocument: 'Exhibition Catalog.pdf', submittedAt: '2 days ago', status: 'APPROVED' },
];

export function SuperAdminView({ initialTab = 'overview' }: SuperAdminViewProps) {
  const [activeTab, setActiveTab] = useState(() => resolveSuperAdminTab(initialTab));
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Users state
  const [users, setUsers] = useState<DemoUserRow[]>(INITIAL_USERS);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL');

  // Claims state
  const [claims, setClaims] = useState<ClaimRow[]>(INITIAL_CLAIMS);

  // Platform settings state
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [openRegistration, setOpenRegistration] = useState(true);
  const [require2FA, setRequire2FA] = useState(true);
  const [rateLimit, setRateLimit] = useState(120);

  // Profiles verification state
  const [profileStatuses, setProfileStatuses] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    mockPeople.forEach((p) => {
      map[p.id] = p.verificationStatus === 'VERIFIED';
    });
    return map;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // User management actions
  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          showToast(`User ${u.name} status changed to ${newStatus}`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  // Claim actions
  const handleApproveClaim = (id: string, name: string) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'APPROVED' } : c))
    );
    showToast(`Claim for "${name}" approved successfully! Verified badge granted.`);
  };

  const handleRejectClaim = (id: string, name: string) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'REJECTED' } : c))
    );
    showToast(`Claim for "${name}" rejected.`);
  };

  const toggleProfileVerification = (id: string, name: string) => {
    setProfileStatuses((prev) => {
      const nextVal = !prev[id];
      showToast(`Profile "${name}" verification ${nextVal ? 'granted' : 'revoked'}.`);
      return { ...prev, [id]: nextVal };
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, userSearch, userRoleFilter]);

  const pendingClaimsCount = claims.filter((c) => c.status === 'PENDING').length;

  return (
    <DashboardLayout requiredRole="SUPER_ADMIN">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3"
            style={{
              background: '#0F172A',
              border: '1px solid #C7FF61',
              color: '#F8FAFC',
              boxShadow: '0 10px 25px rgba(199, 255, 97, 0.2)',
            }}
          >
            <CheckCircle2 size={18} style={{ color: '#C7FF61' }} />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C7FF61] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#C7FF61]">
                Super Administrator Master Console
              </span>
            </div>
            <h1
              className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Platform Overview & Control
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('Platform cache purged and sync completed!')}
              className="btn btn-secondary text-xs px-3 py-2 flex items-center gap-1.5"
            >
              <RefreshCw size={14} /> Purge Cache
            </button>
            <button
              onClick={() => showToast('System audit log exported to CSV.')}
              className="btn btn-secondary text-xs px-3 py-2 flex items-center gap-1.5"
            >
              <Download size={14} /> Export Report
            </button>
          </div>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)] mb-2">
              <span>Total Users</span>
              <Users size={16} className="text-[#60A5FA]" />
            </div>
            <div className="text-2xl font-black" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              14,820
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#34D399] mt-1 font-medium">
              <TrendingUp size={12} /> +12.4% this month
            </div>
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)] mb-2">
              <span>Verified Profiles</span>
              <UserCheck size={16} className="text-[#C7FF61]" />
            </div>
            <div className="text-2xl font-black" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              3,410
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1">
              84.2% verified rate
            </div>
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)] mb-2">
              <span>Pending Claims</span>
              <AlertCircle size={16} className="text-[#F59E0B]" />
            </div>
            <div className="text-2xl font-black text-[#F59E0B]" style={{ fontFamily: 'var(--font-display)' }}>
              {pendingClaimsCount}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1">
              Requires manual verification
            </div>
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)] mb-2">
              <span>System Health</span>
              <Server size={16} className="text-[#34D399]" />
            </div>
            <div className="text-2xl font-black text-[#34D399]" style={{ fontFamily: 'var(--font-display)' }}>
              99.98%
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1">
              All clusters operational
            </div>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="dashboard-tabs">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Users & Accounts' },
            { id: 'claims', label: `Claims Queue (${pendingClaimsCount})` },
            { id: 'profiles', label: 'People Profiles' },
            { id: 'roles', label: 'Role Permissions' },
            { id: 'settings', label: 'Platform Settings' },
            { id: 'audit', label: 'Audit History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                activeTab === tab.id
                  ? 'bg-[#C7FF61] text-[#0B0D12] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Claims Preview Box */}
              <div
                className="lg:col-span-2 p-5 rounded-2xl space-y-4"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    Pending Profile Claim Requests
                  </h3>
                  <button
                    onClick={() => setActiveTab('claims')}
                    className="text-xs text-[#C7FF61] hover:underline flex items-center gap-1 font-semibold"
                  >
                    View All ({pendingClaimsCount}) <ChevronRight size={13} />
                  </button>
                </div>

                <div className="divide-y divide-[var(--border-subtle)]">
                  {claims.slice(0, 3).map((claim) => (
                    <div key={claim.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                            {claim.profileName}
                          </p>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                              claim.status === 'PENDING'
                                ? 'bg-amber-500/10 text-amber-400'
                                : claim.status === 'APPROVED'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {claim.status}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] truncate">
                          Claimed by {claim.claimantName} &bull; {claim.proofDocument}
                        </p>
                      </div>

                      {claim.status === 'PENDING' && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleApproveClaim(claim.id, claim.profileName)}
                            className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                            title="Approve"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => handleRejectClaim(claim.id, claim.profileName)}
                            className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 transition-colors"
                            title="Reject"
                          >
                            <XCircle size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform Activity */}
              <div
                className="p-5 rounded-2xl space-y-4"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
              >
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Platform Diagnostics
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1 text-[var(--text-secondary)]">
                      <span>Database Cluster (Primary)</span>
                      <span className="text-[#34D399] font-mono">18% Load</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[var(--surface-hover)] overflow-hidden">
                      <div className="h-full bg-[#34D399] rounded-full" style={{ width: '18%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-[var(--text-secondary)]">
                      <span>Search Indexing Latency</span>
                      <span className="text-[#C7FF61] font-mono">32ms</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[var(--surface-hover)] overflow-hidden">
                      <div className="h-full bg-[#C7FF61] rounded-full" style={{ width: '25%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-[var(--text-secondary)]">
                      <span>Memory Allocation</span>
                      <span className="text-[#60A5FA] font-mono">4.2GB / 16GB</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[var(--surface-hover)] overflow-hidden">
                      <div className="h-full bg-[#60A5FA] rounded-full" style={{ width: '30%' }} />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--text-tertiary)]">Environment</span>
                      <span className="font-mono text-xs">Production (Demo Mode)</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--text-tertiary)]">FastAPI Backend</span>
                      <span className="text-[#34D399] font-semibold">Ready for Bridge</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: USERS */}
        {activeTab === 'users' && (
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
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search users by name or email..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-[#C7FF61]"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-secondary)]"
                >
                  <option value="ALL">All Roles</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MODERATOR">Moderator</option>
                  <option value="CREATOR">Creator</option>
                  <option value="USER">User</option>
                </select>
              </div>

              <button
                onClick={() => showToast('New user invite dialog opened.')}
                className="btn btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus size={14} /> Invite User
              </button>
            </div>

            <div
              className="table-scroll"
              tabIndex={0}
              role="region"
              aria-label="User accounts table; scroll horizontally for status and actions"
              data-responsive-table
            >
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] text-[var(--text-tertiary)]">
                    <th className="py-2.5 px-3">User</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Joined</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                            style={{ background: `${user.avatarColor}20`, color: user.avatarColor }}
                          >
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {user.name}
                            </p>
                            <p className="text-[11px] text-[var(--text-secondary)]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold"
                          style={{
                            background: `${user.avatarColor}15`,
                            color: user.avatarColor,
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            user.status === 'ACTIVE'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-rose-500/15 text-rose-400'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[var(--text-secondary)]">{user.joinedDate}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                            user.status === 'ACTIVE'
                              ? 'text-rose-400 hover:bg-rose-500/10'
                              : 'text-emerald-400 hover:bg-emerald-500/10'
                          }`}
                        >
                          {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: CLAIMS */}
        {activeTab === 'claims' && (
          <div
            className="p-5 rounded-2xl space-y-4"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Profile Verification Claim Station
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Review identity verification proofs and assign verified badges.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {claims.map((claim) => (
                <div
                  key={claim.id}
                  className="p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                  style={{
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                        Target Profile: {claim.profileName}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          claim.status === 'PENDING'
                            ? 'bg-amber-500/10 text-amber-400'
                            : claim.status === 'APPROVED'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Submitted by: <strong className="text-[var(--text-primary)]">{claim.claimantName}</strong> ({claim.claimantEmail})
                    </p>
                    <p className="text-xs font-mono text-[#60A5FA]">
                      Document: {claim.proofDocument} &bull; {claim.submittedAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {claim.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleApproveClaim(claim.id, claim.profileName)}
                          className="btn btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
                        >
                          <Check size={14} /> Grant Verified Badge
                        </button>
                        <button
                          onClick={() => handleRejectClaim(claim.id, claim.profileName)}
                          className="btn btn-secondary text-xs px-3 py-1.5 text-rose-400 hover:text-rose-300"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-[var(--text-tertiary)] italic">
                        Resolved as {claim.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PROFILES */}
        {activeTab === 'profiles' && (
          <div
            className="p-5 rounded-2xl space-y-4"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Platform Profiles Directory ({mockPeople.length})
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Manage verification badges and profile visibility platform-wide.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockPeople.map((person) => {
                const isVerified = profileStatuses[person.id];
                return (
                  <div
                    key={person.id}
                    className="p-3.5 rounded-xl flex items-center justify-between gap-3"
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
                          {isVerified && (
                            <CheckCircle2 size={13} className="text-[#C7FF61] shrink-0" />
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
                        target="_blank"
                        className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                        title="View Public Profile"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <button
                        onClick={() => toggleProfileVerification(person.id, person.fullName)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                          isVerified
                            ? 'bg-[#C7FF61]/15 text-[#C7FF61] hover:bg-rose-500/15 hover:text-rose-400'
                            : 'bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:bg-[#C7FF61]/20 hover:text-[#C7FF61]'
                        }`}
                      >
                        {isVerified ? 'Verified' : 'Verify'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: ROLES & PERMISSIONS */}
        {activeTab === 'roles' && (
          <div
            className="p-5 rounded-2xl space-y-4"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                Role-Based Access Control (RBAC) Matrix
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Permissions assigned across the 5 platform roles.
              </p>
            </div>

            <div
              className="table-scroll"
              tabIndex={0}
              role="region"
              aria-label="Audit history table; scroll horizontally for full event details"
              data-responsive-table
            >
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] text-[var(--text-tertiary)]">
                    <th className="py-2.5 px-3">Permission Node</th>
                    <th className="py-2.5 px-3 text-center text-[#C7FF61]">SUPER_ADMIN</th>
                    <th className="py-2.5 px-3 text-center text-[#60A5FA]">ADMIN</th>
                    <th className="py-2.5 px-3 text-center text-[#F59E0B]">MODERATOR</th>
                    <th className="py-2.5 px-3 text-center text-[#A78BFA]">CREATOR</th>
                    <th className="py-2.5 px-3 text-center text-[#34D399]">USER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {[
                    { node: 'manage:users', s: true, a: false, m: false, c: false, u: false },
                    { node: 'manage:roles_permissions', s: true, a: false, m: false, c: false, u: false },
                    { node: 'manage:system_settings', s: true, a: false, m: false, c: false, u: false },
                    { node: 'manage:profiles', s: true, a: true, m: false, c: false, u: false },
                    { node: 'manage:categories', s: true, a: true, m: false, c: false, u: false },
                    { node: 'review:claims', s: true, a: true, m: true, c: false, u: false },
                    { node: 'moderate:content', s: true, a: true, m: true, c: false, u: false },
                    { node: 'edit:own_profile', s: true, a: true, m: true, c: true, u: false },
                    { node: 'save_bookmarks:profiles', s: true, a: true, m: true, c: true, u: true },
                    { node: 'browse:public_directory', s: true, a: true, m: true, c: true, u: true },
                  ].map((row) => (
                    <tr key={row.node} className="hover:bg-[var(--surface-hover)]">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-[var(--text-primary)]">
                        {row.node}
                      </td>
                      <td className="py-2.5 px-3 text-center">{row.s ? '✓' : '—'}</td>
                      <td className="py-2.5 px-3 text-center">{row.a ? '✓' : '—'}</td>
                      <td className="py-2.5 px-3 text-center">{row.m ? '✓' : '—'}</td>
                      <td className="py-2.5 px-3 text-center">{row.c ? '✓' : '—'}</td>
                      <td className="py-2.5 px-3 text-center">{row.u ? '✓' : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: SETTINGS */}
        {activeTab === 'settings' && (
          <div
            className="p-5 rounded-2xl space-y-6 max-w-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                Global Platform Governance Settings
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Adjust platform wide security, rate limits, and registration flags.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Maintenance Mode
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Only administrators can log in and view pages when enabled.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setMaintenanceMode(!maintenanceMode);
                    showToast(`Maintenance mode ${!maintenanceMode ? 'ENABLED' : 'DISABLED'}`);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    maintenanceMode ? 'bg-[#C7FF61]' : 'bg-[var(--surface-active)]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-[#0B0D12] transition-transform ${
                      maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Public Registration
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Allow new creators and explorers to register accounts.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setOpenRegistration(!openRegistration);
                    showToast(`Public registration ${!openRegistration ? 'OPENED' : 'PAUSED'}`);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    openRegistration ? 'bg-[#C7FF61]' : 'bg-[var(--surface-active)]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-[#0B0D12] transition-transform ${
                      openRegistration ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Require Two-Factor Auth (2FA) for Admins
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Mandatory TOTP authenticator verification for elevated roles.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setRequire2FA(!require2FA);
                    showToast(`2FA policy updated to ${!require2FA ? 'ENFORCED' : 'OPTIONAL'}`);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    require2FA ? 'bg-[#C7FF61]' : 'bg-[var(--surface-active)]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-[#0B0D12] transition-transform ${
                      require2FA ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    API Rate Limiting Threshold
                  </span>
                  <span className="font-mono text-[#C7FF61] font-bold">{rateLimit} req / min</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="300"
                  step="10"
                  value={rateLimit}
                  onChange={(e) => setRateLimit(Number(e.target.value))}
                  className="w-full accent-[#C7FF61]"
                />
              </div>

              <button
                onClick={() => showToast('Platform configuration saved successfully!')}
                className="btn btn-primary text-xs px-5 py-2.5"
              >
                Save Governance Settings
              </button>
            </div>
          </div>
        )}

        {/* TAB: AUDIT */}
        {activeTab === 'audit' && (
          <div
            className="p-5 rounded-2xl space-y-4"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Security & Activity Audit Trail
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Immutable event log recording all sensitive administrator actions.
                </p>
              </div>
            </div>

            <div className="divide-y divide-[var(--border-subtle)] text-xs font-mono">
              {[
                { time: '2026-10-25 12:45:10', actor: 'Alex Karimov', event: 'APPROVED_CLAIM', target: 'Aiko Nakamura (Artist Mgmt)', ip: '192.168.1.104' },
                { time: '2026-10-25 11:20:04', actor: 'Sofia Marchetti', event: 'UPDATED_CATEGORY', target: 'Jazz & Improvisational Music', ip: '10.0.4.82' },
                { time: '2026-10-25 09:15:33', actor: 'James Okafor', event: 'RESOLVED_MODERATION', target: 'Flag #8410 Dismissed', ip: '172.16.2.14' },
                { time: '2026-10-25 08:02:19', actor: 'Alex Karimov', event: 'PURGED_CACHE', target: 'Edge Redis Cluster 01', ip: '192.168.1.104' },
                { time: '2026-10-24 23:44:12', actor: 'SYSTEM_DAEMON', event: 'BACKUP_SNAPSHOT', target: 'S3 Automated Snapshot #3182', ip: '127.0.0.1' },
              ].map((log, i) => (
                <div key={i} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-tertiary)] text-[11px]">{log.time}</span>
                    <span className="text-[#C7FF61] font-semibold">{log.actor}</span>
                    <span className="px-1.5 py-0.5 rounded bg-[var(--surface-active)] text-[10px] text-[var(--text-primary)]">
                      {log.event}
                    </span>
                    <span className="text-[var(--text-secondary)]">{log.target}</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-tertiary)]">{log.ip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
