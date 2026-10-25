'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LogOut,
  ChevronRight,
  RefreshCw,
  Bell,
  Shield,
  Settings,
  Eye,
  User,
  Compass,
  LayoutDashboard,
  Users,
  FolderOpen,
  FileText,
  BarChart3,
  CheckSquare,
  Image,
  Sliders,
  History,
  Bookmark,
  Star,
  Edit,
  Award,
  Globe,
} from 'lucide-react';
import { getDemoSession, clearDemoSession, startDemoSession } from '@/lib/demo/session';
import { DEMO_ROLE_METADATA } from '@/lib/demo/types';
import type { DemoRole, DemoSession } from '@/lib/demo/types';
import { ROLE_DASHBOARD_MAP } from '@/lib/demo/types';
import { cn } from '@/lib/utils';

// ============================================================
// SIDEBAR NAVIGATION CONFIG
// ============================================================

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const ROLE_NAV: Record<DemoRole, NavItem[]> = {
  SUPER_ADMIN: [
    { label: 'Overview', href: '/dashboard/super-admin', icon: LayoutDashboard },
    { label: 'Users', href: '/dashboard/super-admin/users', icon: Users },
    { label: 'Roles & Permissions', href: '/dashboard/super-admin/roles', icon: Shield },
    { label: 'People Profiles', href: '/dashboard/super-admin/profiles', icon: User },
    { label: 'Categories', href: '/dashboard/super-admin/categories', icon: FolderOpen },
    { label: 'Profile Claims', href: '/dashboard/super-admin/claims', icon: CheckSquare },
    { label: 'Content Moderation', href: '/dashboard/super-admin/moderation', icon: Eye },
    { label: 'Reports & Activity', href: '/dashboard/super-admin/reports', icon: BarChart3 },
    { label: 'Platform Settings', href: '/dashboard/super-admin/settings', icon: Settings },
    { label: 'Audit History', href: '/dashboard/super-admin/audit', icon: History },
  ],
  ADMIN: [
    { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'People Management', href: '/dashboard/admin/profiles', icon: Users },
    { label: 'Categories', href: '/dashboard/admin/categories', icon: FolderOpen },
    { label: 'Content Management', href: '/dashboard/admin/content', icon: FileText },
    { label: 'Claim Review', href: '/dashboard/admin/claims', icon: CheckSquare },
    { label: 'Media', href: '/dashboard/admin/media', icon: Image },
    { label: 'Reports', href: '/dashboard/admin/reports', icon: BarChart3 },
    { label: 'Account Settings', href: '/dashboard/admin/settings', icon: Settings },
  ],
  MODERATOR: [
    { label: 'Overview', href: '/dashboard/moderator', icon: LayoutDashboard },
    { label: 'Pending Reviews', href: '/dashboard/moderator/pending', icon: CheckSquare },
    { label: 'Reported Profiles', href: '/dashboard/moderator/reported', icon: FileText },
    { label: 'Content Review', href: '/dashboard/moderator/content', icon: Eye },
    { label: 'Moderation History', href: '/dashboard/moderator/history', icon: History },
    { label: 'Account Settings', href: '/dashboard/moderator/settings', icon: Settings },
  ],
  CREATOR: [
    { label: 'Overview', href: '/dashboard/creator', icon: LayoutDashboard },
    { label: 'My Profile', href: '/dashboard/creator/profile', icon: User },
    { label: 'Edit Biography', href: '/dashboard/creator/biography', icon: Edit },
    { label: 'Achievements', href: '/dashboard/creator/achievements', icon: Award },
    { label: 'Projects', href: '/dashboard/creator/projects', icon: FolderOpen },
    { label: 'Gallery', href: '/dashboard/creator/gallery', icon: Image },
    { label: 'Social Links', href: '/dashboard/creator/social', icon: Globe },
    { label: 'Claim Status', href: '/dashboard/creator/claim', icon: CheckSquare },
    { label: 'Settings', href: '/dashboard/creator/settings', icon: Settings },
  ],
  USER: [
    { label: 'Discover', href: '/dashboard/user', icon: Compass },
    { label: 'Saved Profiles', href: '/dashboard/user/saved', icon: Bookmark },
    { label: 'Recently Viewed', href: '/dashboard/user/recent', icon: History },
    { label: 'Categories', href: '/dashboard/user/categories', icon: FolderOpen },
    { label: 'Preferences', href: '/dashboard/user/preferences', icon: Sliders },
    { label: 'Account', href: '/dashboard/user/account', icon: User },
  ],
};

const ROLE_ICONS: Record<DemoRole, React.ElementType> = {
  SUPER_ADMIN: Shield,
  ADMIN: Settings,
  MODERATOR: Eye,
  CREATOR: Star,
  USER: Compass,
};

const ROLE_COLORS: Record<DemoRole, string> = {
  SUPER_ADMIN: '#C7FF61',
  ADMIN: '#60A5FA',
  MODERATOR: '#F59E0B',
  CREATOR: '#A78BFA',
  USER: '#34D399',
};

// ============================================================
// SWITCH DEMO ACCOUNT PANEL
// ============================================================

function SwitchPanel({ onClose, onSwitch }: { onClose: () => void; onSwitch: (role: DemoRole) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
      >
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 className="font-bold text-base" style={{ fontFamily: 'var(--font-display)' }}>
            Switch Demo Account
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost p-2"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5 grid grid-cols-1 gap-2">
          {DEMO_ROLE_METADATA.map((meta) => {
            const Icon = ROLE_ICONS[meta.role];
            return (
              <button
                key={meta.role}
                onClick={() => onSwitch(meta.role)}
                className="flex items-center gap-4 p-3.5 rounded-xl transition-all duration-150 text-left group"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${meta.color}18` }}
                >
                  <Icon size={16} style={{ color: meta.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{meta.user.name}</p>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded" style={{ background: `${meta.color}20`, color: meta.color }}>
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{meta.user.email}</p>
                </div>
                <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} />
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// DASHBOARD LAYOUT
// ============================================================

export function DashboardLayout({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole: DemoRole;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<DemoSession | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSwitch, setShowSwitch] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const s = getDemoSession();
    if (!s) {
      router.push('/login');
      return;
    }
    if (s.user.role !== requiredRole) {
      // Wrong role — redirect to correct dashboard
      router.push(ROLE_DASHBOARD_MAP[s.user.role]);
      return;
    }
    setSession(s);
  }, [requiredRole, router]);

  const handleLogout = useCallback(() => {
    clearDemoSession();
    router.push('/login');
  }, [router]);

  const handleSwitch = useCallback(
    async (role: DemoRole) => {
      setShowSwitch(false);
      const newSession = startDemoSession(role);
      setSession(newSession);
      router.push(ROLE_DASHBOARD_MAP[role]);
    },
    [router]
  );

  if (!mounted || !session) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg-base)' }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }}
          />
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const role = session.user.role;
  const navItems = ROLE_NAV[role];
  const RoleIcon = ROLE_ICONS[role];
  const roleColor = ROLE_COLORS[role];
  const roleMeta = DEMO_ROLE_METADATA.find((m) => m.role === role)!;

  const isActiveNav = (href: string) =>
    pathname === href || (href !== `/dashboard/${role.toLowerCase().replace('_', '-')}` && pathname.startsWith(href));

  return (
    <>
      {/* Switch panel */}
      <AnimatePresence>
        {showSwitch && (
          <SwitchPanel onClose={() => setShowSwitch(false)} onSwitch={handleSwitch} />
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div
        className="min-h-screen flex"
        style={{ background: 'var(--bg-base)', fontFamily: 'var(--font-sans)' }}
      >
        {/* ═══ SIDEBAR ═══ */}
        <motion.aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex flex-col w-64 lg:static lg:z-auto',
            'transition-transform duration-300 lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          style={{
            background: 'var(--bg-elevated)',
            borderRight: '1px solid var(--border-subtle)',
            width: '260px',
            minWidth: '260px',
          }}
        >
          {/* Sidebar top: logo + close */}
          <div
            className="flex items-center justify-between px-5 h-16 shrink-0"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <Link href="/" className="flex items-center gap-2 group" aria-label="MOVA Home">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'var(--accent-primary)' }}
              >
                <span
                  className="font-black text-xs leading-none"
                  style={{ color: '#0B0D12', fontFamily: 'var(--font-display)' }}
                >
                  M
                </span>
              </div>
              <span
                className="font-black text-base tracking-tight"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                MOVA
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden btn btn-ghost p-1.5"
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          </div>

          {/* Role badge */}
          <div className="px-4 py-3 shrink-0">
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: `${roleColor}10`, border: `1px solid ${roleColor}20` }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${roleColor}20` }}
              >
                <RoleIcon size={15} style={{ color: roleColor }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: roleColor }}>
                  {roleMeta.label}
                </p>
                <p className="text-[10px] truncate" style={{ color: 'var(--text-tertiary)' }}>
                  {session.user.name}
                </p>
              </div>
              <span
                className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded shrink-0"
                style={{ background: `${roleColor}20`, color: roleColor }}
              >
                Demo
              </span>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto px-3 py-2" aria-label="Dashboard navigation">
            <p className="text-[10px] font-semibold uppercase tracking-widest px-2 mb-2"
              style={{ color: 'var(--text-tertiary)' }}>
              Navigation
            </p>
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = isActiveNav(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-0.5 text-sm transition-all duration-150 group',
                    active ? 'font-semibold' : 'font-normal'
                  )}
                  style={{
                    background: active ? `${roleColor}12` : 'transparent',
                    color: active ? roleColor : 'var(--text-secondary)',
                    border: active ? `1px solid ${roleColor}20` : '1px solid transparent',
                  }}
                >
                  <Icon size={15} className="shrink-0" />
                  <span className="truncate">{label}</span>
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="ml-auto w-1 h-4 rounded-full shrink-0"
                      style={{ background: roleColor }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar bottom */}
          <div
            className="p-4 space-y-2 shrink-0"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <button
              onClick={() => setShowSwitch(true)}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
              style={{ color: 'var(--text-secondary)', background: 'var(--surface-hover)' }}
            >
              <RefreshCw size={14} />
              Switch Account
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
              style={{ color: '#f87171', background: 'rgba(239,68,68,0.06)' }}
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </motion.aside>

        {/* ═══ MAIN CONTENT ═══ */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top nav bar */}
          <header
            className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 h-16 shrink-0"
            style={{
              background: 'var(--bg-elevated)',
              borderBottom: '1px solid var(--border-subtle)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden btn btn-ghost p-2"
                aria-label="Open navigation"
              >
                <Menu size={18} />
              </button>
              {/* Breadcrumb stub */}
              <div className="hidden sm:flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                <span>Dashboard</span>
                <ChevronRight size={12} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                  {roleMeta.label}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Demo badge */}
              <div
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: 'rgba(245,158,11,0.1)',
                  color: '#F59E0B',
                  border: '1px solid rgba(245,158,11,0.2)',
                }}
              >
                Demo Mode
              </div>

              {/* Notification bell — decorative */}
              <button className="btn btn-ghost p-2 relative" aria-label="Notifications">
                <Bell size={16} />
                <span
                  className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--accent-primary)' }}
                />
              </button>

              {/* Avatar */}
              <button
                onClick={() => setShowSwitch(true)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: roleColor, color: '#0B0D12' }}
                aria-label="Switch account"
                title={`${session.user.name} — Click to switch`}
              >
                {session.user.avatarInitials}
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto p-4 lg:p-6" id="dashboard-main">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
