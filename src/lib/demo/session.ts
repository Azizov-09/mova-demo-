'use client';

import type { DemoRole, DemoSession, RoleMetadata } from './types';
import { DEMO_SESSION_KEY, DEMO_ROLE_METADATA, getRoleMetadata } from './types';

// ============================================================
// DEMO SESSION ADAPTER
// Client-side only. Never treat as real authorization.
// ============================================================

export function startDemoSession(role: DemoRole): DemoSession {
  const meta = getRoleMetadata(role);
  const session: DemoSession = {
    isDemo: true,
    user: meta.user,
    enteredAt: new Date().toISOString(),
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
  }
  return session;
}

export function getDemoSession(): DemoSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as DemoSession;
    if (!session.isDemo || !session.user) return null;
    return session;
  } catch {
    return null;
  }
}

export function clearDemoSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DEMO_SESSION_KEY);
  }
}

export function getCurrentDemoRole(): DemoRole | null {
  const session = getDemoSession();
  return session?.user?.role ?? null;
}

export function hasPermission(role: DemoRole | null, permission: string): boolean {
  if (!role) return false;
  try {
    const meta = getRoleMetadata(role);
    return meta.permissions.includes(permission);
  } catch {
    return false;
  }
}

export { DEMO_ROLE_METADATA, getRoleMetadata };
export type { DemoRole, DemoSession, RoleMetadata };
