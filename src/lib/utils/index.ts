import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatYear(dateString: string): string {
  return new Date(dateString).getFullYear().toString();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['https:', 'http:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function getSafeImageUrl(url: string, fallback: string): string {
  if (!url || !isSafeUrl(url)) return fallback;
  return url;
}

export function formatFollowerCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

export function toPublicPerson(person: import('@/types').Person): import('@/types').PublicPerson {
  return {
    ...person,
    appearance:
      person.visibility.appearance === 'PUBLIC' && person.appearance
        ? {
            heightCm: person.appearance.heightCm,
            hairColor: person.appearance.hairColor,
            eyeColor: person.appearance.eyeColor,
            sourceType: person.appearance.sourceType,
          }
        : undefined,
    currentActivity:
      person.visibility.currentActivity === 'PUBLIC' ? person.currentActivity : undefined,
    gallery: person.visibility.gallery === 'PUBLIC' ? person.gallery : [],
    socialAccounts: person.visibility.socialAccounts === 'PUBLIC' ? person.socialAccounts : [],
  };
}

