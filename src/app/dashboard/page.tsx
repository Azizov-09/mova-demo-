'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield,
  Settings,
  Eye,
  User,
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { getDemoSession, startDemoSession } from '@/lib/demo/session';
import { DEMO_ROLE_METADATA, ROLE_DASHBOARD_MAP, type DemoRole } from '@/lib/demo/types';

export default function DashboardIndexPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const session = getDemoSession();
    if (session && session.user && session.user.role) {
      const targetRoute = ROLE_DASHBOARD_MAP[session.user.role];
      if (targetRoute) {
        router.replace(targetRoute);
      }
    }
  }, [router]);

  const handleLaunchRole = (role: DemoRole) => {
    startDemoSession(role);
    router.push(ROLE_DASHBOARD_MAP[role]);
  };

  const roleIcons = {
    SUPER_ADMIN: Shield,
    ADMIN: Settings,
    MODERATOR: Eye,
    CREATOR: User,
    USER: Compass,
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: 'var(--bg-base)', fontFamily: 'var(--font-sans)' }}
    >
      <div className="w-full max-w-4xl mx-auto text-center mb-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: 'var(--accent-primary)' }}
          >
            <span
              className="font-black text-sm"
              style={{ color: '#0B0D12', fontFamily: 'var(--font-display)' }}
            >
              M
            </span>
          </div>
          <span
            className="font-black text-2xl tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            MOVA
          </span>
        </Link>

        <h1
          className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Select Your Demo Dashboard
        </h1>
        <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Explore the MOVA platform through any of our 5 role perspectives. Choose a role below to enter its specialized dashboard with full interactive capabilities.
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {DEMO_ROLE_METADATA.map((roleMeta, idx) => {
          const Icon = roleIcons[roleMeta.role];
          const isFull = idx === 0;

          return (
            <motion.div
              key={roleMeta.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.3 }}
              className={`group relative rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isFull ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
              }}
              onClick={() => handleLaunchRole(roleMeta.role)}
              whileHover={{
                y: -4,
                borderColor: roleMeta.color,
                boxShadow: `0 12px 30px ${roleMeta.color}15`,
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                    style={{ background: `${roleMeta.color}18`, color: roleMeta.color }}
                  >
                    <Icon size={24} />
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider"
                    style={{
                      background: `${roleMeta.color}15`,
                      color: roleMeta.color,
                      border: `1px solid ${roleMeta.color}30`,
                    }}
                  >
                    {roleMeta.role.replace('_', ' ')}
                  </span>
                </div>

                <h3
                  className="text-lg font-bold mb-1 group-hover:text-[var(--text-primary)] transition-colors"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                  {roleMeta.label}
                </h3>
                <p className="text-xs mb-3 font-medium" style={{ color: roleMeta.color }}>
                  {roleMeta.user.name} &bull; {roleMeta.user.title}
                </p>
                <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {roleMeta.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                  {roleMeta.permissions.length} Permissions
                </span>
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold group-hover:translate-x-1 transition-transform"
                  style={{ color: roleMeta.color }}
                >
                  Enter <ArrowRight size={13} />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-tertiary)' }}>
        <Link href="/" className="hover:underline flex items-center gap-1">
          &larr; Back to Home
        </Link>
        <span>&bull;</span>
        <Link href="/login" className="hover:underline">
          Go to Login Gateway
        </Link>
      </div>
    </div>
  );
}
