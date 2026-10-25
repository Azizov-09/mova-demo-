// ============================================================
// MOVA Demo Auth System — Types & Role Definitions
// ============================================================

export type DemoRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MODERATOR'
  | 'CREATOR'
  | 'USER';

export interface DemoUser {
  id: string;
  role: DemoRole;
  name: string;
  email: string;
  avatarInitials: string;
  avatarColor: string;
  title: string;
  joinedDate: string;
}

export interface DemoSession {
  isDemo: boolean;
  user: DemoUser;
  enteredAt: string;
}

export interface RoleMetadata {
  role: DemoRole;
  label: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  dashboardRoute: string;
  permissions: string[];
  user: DemoUser;
}

export const ROLE_DASHBOARD_MAP: Record<DemoRole, string> = {
  SUPER_ADMIN: '/dashboard/super-admin',
  ADMIN: '/dashboard/admin',
  MODERATOR: '/dashboard/moderator',
  CREATOR: '/dashboard/creator',
  USER: '/dashboard/user',
};

export const DEMO_ROLE_METADATA: RoleMetadata[] = [
  {
    role: 'SUPER_ADMIN',
    label: 'Super Admin',
    description:
      'Full platform management and oversight. Manage users, roles, profiles, and global settings.',
    icon: 'Shield',
    color: '#C7FF61',
    bgColor: 'rgba(199, 255, 97, 0.08)',
    dashboardRoute: '/dashboard/super-admin',
    permissions: [
      'manage:users',
      'manage:roles',
      'manage:profiles',
      'manage:categories',
      'manage:claims',
      'manage:content',
      'view:reports',
      'view:audit',
      'manage:settings',
    ],
    user: {
      id: 'demo-super-admin-1',
      role: 'SUPER_ADMIN',
      name: 'Alex Karimov',
      email: 'superadmin@mova.demo',
      avatarInitials: 'AK',
      avatarColor: '#C7FF61',
      title: 'Platform Super Administrator',
      joinedDate: '2023-01-01',
    },
  },
  {
    role: 'ADMIN',
    label: 'Admin',
    description:
      'Manage profiles, categories, and platform content within delegated permissions.',
    icon: 'Settings',
    color: '#60A5FA',
    bgColor: 'rgba(96, 165, 250, 0.08)',
    dashboardRoute: '/dashboard/admin',
    permissions: [
      'manage:profiles',
      'manage:categories',
      'manage:content',
      'review:claims',
      'view:reports',
    ],
    user: {
      id: 'demo-admin-1',
      role: 'ADMIN',
      name: 'Sofia Marchetti',
      email: 'admin@mova.demo',
      avatarInitials: 'SM',
      avatarColor: '#60A5FA',
      title: 'Platform Administrator',
      joinedDate: '2023-03-15',
    },
  },
  {
    role: 'MODERATOR',
    label: 'Moderator',
    description: 'Review submitted content and reported profiles for quality and compliance.',
    icon: 'Eye',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.08)',
    dashboardRoute: '/dashboard/moderator',
    permissions: ['review:content', 'review:reports', 'moderate:profiles'],
    user: {
      id: 'demo-moderator-1',
      role: 'MODERATOR',
      name: 'James Okafor',
      email: 'moderator@mova.demo',
      avatarInitials: 'JO',
      avatarColor: '#F59E0B',
      title: 'Content Moderator',
      joinedDate: '2023-06-01',
    },
  },
  {
    role: 'CREATOR',
    label: 'Creator',
    description:
      'Manage your own public profile, achievements, projects, and media on MOVA.',
    icon: 'User',
    color: '#A78BFA',
    bgColor: 'rgba(167, 139, 250, 0.08)',
    dashboardRoute: '/dashboard/creator',
    permissions: ['edit:own-profile', 'manage:own-achievements', 'manage:own-projects'],
    user: {
      id: 'demo-creator-1',
      role: 'CREATOR',
      name: 'Aiko Nakamura',
      email: 'creator@mova.demo',
      avatarInitials: 'AN',
      avatarColor: '#A78BFA',
      title: 'Jazz Pianist & Composer',
      joinedDate: '2022-09-01',
    },
  },
  {
    role: 'USER',
    label: 'User',
    description: 'Discover people, save profiles, and manage personal demo preferences.',
    icon: 'Compass',
    color: '#34D399',
    bgColor: 'rgba(52, 211, 153, 0.08)',
    dashboardRoute: '/dashboard/user',
    permissions: ['browse:profiles', 'save:profiles', 'view:categories'],
    user: {
      id: 'demo-user-1',
      role: 'USER',
      name: 'Sam Rivera',
      email: 'user@mova.demo',
      avatarInitials: 'SR',
      avatarColor: '#34D399',
      title: 'MOVA Explorer',
      joinedDate: '2024-01-10',
    },
  },
];

export function getRoleMetadata(role: DemoRole): RoleMetadata {
  const meta = DEMO_ROLE_METADATA.find((m) => m.role === role);
  if (!meta) throw new Error(`Unknown demo role: ${role}`);
  return meta;
}

export const DEMO_SESSION_KEY = 'mova_demo_session';
