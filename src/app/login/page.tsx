'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Shield,
  Settings,
  Eye as EyeIcon,
  User,
  Compass,
  ChevronRight,
  Sparkles,
  AlertCircle,
  X,
} from 'lucide-react';
import { startDemoSession, DEMO_ROLE_METADATA } from '@/lib/demo/session';
import type { DemoRole, RoleMetadata } from '@/lib/demo/types';

// Icon map for role cards
const ROLE_ICONS: Record<string, React.ElementType> = {
  Shield: Shield,
  Settings: Settings,
  Eye: EyeIcon,
  User: User,
  Compass: Compass,
};

// ============================================================
// DEMO ROLE CARD
// ============================================================

function DemoRoleCard({
  meta,
  onEnter,
  isLoading,
  loadingRole,
  index,
}: {
  meta: RoleMetadata;
  onEnter: (role: DemoRole) => void;
  isLoading: boolean;
  loadingRole: DemoRole | null;
  index: number;
}) {
  const Icon = ROLE_ICONS[meta.icon] ?? User;
  const isThisLoading = loadingRole === meta.role;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.32, delay: 0.08 + index * 0.055 }}
      className="relative group h-full min-w-0"
    >
      <div
        className="relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-200 sm:p-6"
        style={{
          background: meta.bgColor,
          borderColor: isThisLoading
            ? meta.color
            : 'var(--border-subtle)',
        }}
      >
        {/* Glow effect on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 100%, ${meta.color}10, transparent)`,
          }}
        />

        <div className="relative z-10 flex h-full min-w-0 flex-col">
          {/* Icon + label row */}
          <div className="flex items-start justify-between mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${meta.color}18` }}
            >
              <Icon size={18} style={{ color: meta.color }} />
            </div>
            <span
              className="text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full"
              style={{
                color: meta.color,
                background: `${meta.color}15`,
              }}
            >
              Demo
            </span>
          </div>

          <h3
            className="mb-1 text-lg font-bold leading-tight"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            {meta.label}
          </h3>
          <p className="mb-3 text-sm font-semibold leading-snug" style={{ color: meta.color }}>
            {meta.user.name} &bull; {meta.user.title}
          </p>
          <p className="mb-5 flex-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {meta.description}
          </p>

          {/* Demo account label */}
          <p className="mb-4 text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            Demo account:{' '}
            <span className="font-medium break-all" style={{ color: meta.color }}>
              {meta.user.email}
            </span>
          </p>

          <button
            onClick={() => onEnter(meta.role)}
            disabled={isLoading}
            className="mt-auto flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-center text-sm font-semibold leading-snug transition-all duration-200"
            style={{
              background: isThisLoading ? meta.color : `${meta.color}18`,
              color: isThisLoading ? '#0B0D12' : meta.color,
              border: `1px solid ${meta.color}30`,
            }}
          >
            {isThisLoading ? (
              <span className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"
                />
                Entering...
              </span>
            ) : (
              <>
                Enter {meta.label} Demo
                <ChevronRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// LOGIN PAGE
// ============================================================

export default function LoginPage() {
  const router = useRouter();

  // Standard login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Demo session state
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoLoadingRole, setDemoLoadingRole] = useState<DemoRole | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<'login' | 'demo'>('demo');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!email || !password) {
      setLoginError('Please enter your email and password.');
      return;
    }
    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      setLoginError(
        'Authentication backend is not available in this demo environment. Please use a Demo Account below.'
      );
    }, 800);
  };

  const handleDemoEnter = async (role: DemoRole) => {
    setDemoLoading(true);
    setDemoLoadingRole(role);
    await new Promise((r) => setTimeout(r, 700));
    const session = startDemoSession(role);
    router.push(session.user.role === 'SUPER_ADMIN' ? '/dashboard/super-admin'
      : session.user.role === 'ADMIN' ? '/dashboard/admin'
      : session.user.role === 'MODERATOR' ? '/dashboard/moderator'
      : session.user.role === 'CREATOR' ? '/dashboard/creator'
      : '/dashboard/user');
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Ambient background */}
      <div
        className="absolute top-0 left-1/2 h-[500px] w-[min(900px,100vw)] -translate-x-1/2 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(199,255,97,0.06) 0%, transparent 70%)',
        }}
      />
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-5"
          style={{ background: 'var(--accent-primary)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-5"
          style={{ background: '#60A5FA', filter: 'blur(80px)' }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top bar */}
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 2xl:max-w-[1600px]">
          <Link href="/" className="flex items-center gap-2 group" aria-label="MOVA Home">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'var(--accent-primary)' }}
            >
              <span
                className="font-black text-sm leading-none"
                style={{ color: '#0B0D12', fontFamily: 'var(--font-display)' }}
              >
                M
              </span>
            </div>
            <span
              className="font-black text-xl tracking-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              MOVA
            </span>
          </Link>
          <Link
            href="/explore"
            className="text-sm flex items-center gap-1.5 transition-colors duration-150"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span className="hidden sm:inline">Browse without signing in</span>
            <span className="sm:hidden">Explore</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Main content */}
        <div className="flex-1 px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
          <div className="mx-auto w-full max-w-6xl 2xl:max-w-[1480px]">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-7 text-center sm:mb-8"
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
                style={{ background: 'var(--accent-dim)', border: '1px solid rgba(199,255,97,0.2)' }}
              >
                <Sparkles size={12} style={{ color: 'var(--accent-primary)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--accent-primary)' }}>
                  MOVA Demo Environment
                </span>
              </div>
              <h1
                className="text-h1 mb-3"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                Welcome to MOVA
              </h1>
              <p className="text-body-md max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Discover people, explore stories, and experience MOVA with a demo account.
              </p>
            </motion.div>

            {/* Tab switcher */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-6 flex items-center justify-center gap-1"
            >
              <div
                className="flex p-1 rounded-2xl"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
                role="tablist"
              >
                {(['demo', 'login'] as const).map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                    className="relative flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 sm:px-6"
                    style={{
                      color: activeTab === tab ? (tab === 'demo' ? '#0B0D12' : 'var(--text-primary)') : 'var(--text-secondary)',
                      background: activeTab === tab ? (tab === 'demo' ? 'var(--accent-primary)' : 'var(--bg-card)') : 'transparent',
                    }}
                  >
                    {tab === 'demo' ? (
                      <>
                        <Sparkles size={14} aria-hidden />
                        Explore Demo Accounts
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {activeTab === 'demo' ? (
                <motion.div
                  key="demo"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Demo banner */}
                  <div
                    className="mx-auto mb-7 flex max-w-4xl items-start gap-3 rounded-2xl p-4 sm:px-5"
                    style={{
                      background: 'rgba(199,255,97,0.05)',
                      border: '1px solid rgba(199,255,97,0.15)',
                    }}
                  >
                    <AlertCircle size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: 2 }} />
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      <span className="font-semibold" style={{ color: 'var(--accent-primary)' }}>Demo Environment:</span>{' '}
                      All accounts below are fictional and demonstrate different platform roles. No passwords required. 
                      No real data is stored or transmitted. Each role gives access to its dedicated dashboard.
                    </p>
                  </div>

                  {/* Role cards grid */}
                  <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6 xl:gap-5 2xl:max-w-[1480px]">
                    {DEMO_ROLE_METADATA.map((meta, i) => (
                      <div
                        key={meta.role}
                        className={`min-w-0 xl:col-span-2 ${i === 3 ? 'xl:col-start-2' : ''}`}
                      >
                        <DemoRoleCard
                          meta={meta}
                          onEnter={handleDemoEnter}
                          isLoading={demoLoading}
                          loadingRole={demoLoadingRole}
                          index={i}
                        />
                      </div>
                    ))}
                  </div>

                  <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                    Demo sessions persist across browser refreshes but are never treated as real authentication.
                    Future FastAPI backend integration will replace this demo layer.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-md mx-auto"
                >
                  <div
                    className="p-8 rounded-3xl"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {/* Backend unavailable notice */}
                    <div
                      className="flex items-start gap-2.5 p-3.5 rounded-xl mb-6"
                      style={{
                        background: 'rgba(245,158,11,0.08)',
                        border: '1px solid rgba(245,158,11,0.2)',
                      }}
                    >
                      <AlertCircle size={14} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 1 }} />
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        <span className="font-semibold" style={{ color: '#F59E0B' }}>Backend not connected.</span>{' '}
                        Standard login is unavailable. Use the Demo Accounts tab to explore the platform.
                      </p>
                    </div>

                    {/* OAuth buttons */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {[
                        {
                          label: 'Google',
                          icon: (
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z" />
                              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                              <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z" />
                              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z" />
                            </svg>
                          ),
                        },
                        {
                          label: 'GitHub',
                          icon: (
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                          ),
                        },
                      ].map(({ label, icon }) => (
                        <button
                          key={label}
                          type="button"
                          disabled
                          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium opacity-50 cursor-not-allowed"
                          style={{
                            border: '1px solid var(--border-subtle)',
                            background: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {icon}
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="relative flex items-center mb-6">
                      <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
                      <span
                        className="px-3 text-[11px] font-mono uppercase tracking-wider"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        Or with email
                      </span>
                      <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      {loginError && (
                        <div
                          className="p-3 rounded-xl flex items-start gap-2.5 text-xs"
                          style={{
                            background: 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.25)',
                            color: '#f87171',
                          }}
                        >
                          <X size={14} className="shrink-0 mt-0.5" />
                          {loginError}
                        </div>
                      )}

                      <div>
                        <label
                          htmlFor="login-email"
                          className="block text-xs font-medium mb-1.5"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2"
                            style={{ color: 'var(--text-tertiary)' }}
                          />
                          <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-colors"
                            style={{
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-primary)',
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label
                            htmlFor="login-password"
                            className="block text-xs font-medium"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            Password
                          </label>
                          <button
                            type="button"
                            className="text-xs transition-colors"
                            style={{ color: 'var(--accent-primary)' }}
                          >
                            Forgot?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2"
                            style={{ color: 'var(--text-tertiary)' }}
                          />
                          <input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full pl-10 pr-11 py-3 rounded-xl text-sm outline-none transition-colors"
                            style={{
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-primary)',
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                            style={{ color: 'var(--text-tertiary)' }}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loginLoading}
                        className="btn btn-primary w-full py-3 text-sm font-semibold mt-2"
                      >
                        {loginLoading ? (
                          <span className="flex items-center gap-2 justify-center">
                            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            Authenticating...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 justify-center">
                            Sign In
                            <ArrowRight size={15} />
                          </span>
                        )}
                      </button>
                    </form>

                    <div className="mt-6 pt-5 text-center" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Don&apos;t have an account?{' '}
                        <Link
                          href="/register"
                          className="font-semibold hover:underline"
                          style={{ color: 'var(--accent-primary)' }}
                        >
                          Create one
                        </Link>
                      </p>
                    </div>
                  </div>

                  <p className="text-center text-xs mt-5" style={{ color: 'var(--text-tertiary)' }}>
                    Want to explore the platform?{' '}
                    <button
                      onClick={() => setActiveTab('demo')}
                      className="underline"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      Use a Demo Account
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
