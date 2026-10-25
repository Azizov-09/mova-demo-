import { describe, it, expect } from 'vitest';
import {
  cn,
  slugify,
  truncate,
  isSafeUrl,
  getSafeImageUrl,
  formatFollowerCount,
  toPublicPerson,
} from './index';
import type { Person } from '@/types';

describe('Utility Functions', () => {
  it('cn merges class names properly', () => {
    expect(cn('btn', 'btn-primary', false && 'hidden')).toBe('btn btn-primary');
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('slugify converts titles to valid url slugs', () => {
    expect(slugify('Aiko Nakamura')).toBe('aiko-nakamura');
    expect(slugify('Dr. Elena Rostova, Ph.D.')).toBe('dr-elena-rostova-phd');
  });

  it('truncate cuts strings with ellipsis', () => {
    expect(truncate('Hello world', 5)).toBe('Hello…');
    expect(truncate('Short', 10)).toBe('Short');
  });

  it('isSafeUrl validates safe web protocols', () => {
    expect(isSafeUrl('https://example.com')).toBe(true);
    expect(isSafeUrl('http://sub.domain.org/path')).toBe(true);
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('data:text/html,evil')).toBe(false);
    expect(isSafeUrl('invalid-url')).toBe(false);
  });

  it('getSafeImageUrl falls back on unsafe or empty URLs', () => {
    const fallback = 'https://example.com/fallback.jpg';
    expect(getSafeImageUrl('', fallback)).toBe(fallback);
    expect(getSafeImageUrl('javascript:evil', fallback)).toBe(fallback);
    expect(getSafeImageUrl('https://example.com/img.png', fallback)).toBe(
      'https://example.com/img.png'
    );
  });

  it('formatFollowerCount formats numbers with K and M suffix', () => {
    expect(formatFollowerCount(500)).toBe('500');
    expect(formatFollowerCount(1500)).toBe('1.5K');
    expect(formatFollowerCount(2400000)).toBe('2.4M');
  });

  it('toPublicPerson strips private fields like weight and unverified appearance', () => {
    const samplePerson: Person = {
      id: 'test-1',
      slug: 'test-person',
      fullName: 'Test Person',
      professionalTitle: 'Engineer',
      biography: 'Long bio',
      shortBio: 'Short bio',
      avatarUrl: 'https://example.com/avatar.jpg',
      coverImageUrl: 'https://example.com/cover.jpg',
      categories: ['developers'],
      verificationStatus: 'VERIFIED',
      socialAccounts: [{ platform: 'github', url: 'https://github.com' }],
      achievements: [],
      projects: [],
      timeline: [],
      gallery: [{ id: 'g1', url: 'https://example.com/1.jpg', alt: 'img' }],
      appearance: {
        heightCm: 180,
        weightKg: 75,
        hairColor: 'Black',
        eyeColor: 'Brown',
        sourceType: 'VERIFIED_SOURCE',
        visibility: 'PUBLIC',
      },
      visibility: {
        appearance: 'PUBLIC',
        currentActivity: 'PRIVATE',
        socialAccounts: 'PUBLIC',
        gallery: 'PRIVATE',
      },
      updatedAt: '2026-01-01',
      createdAt: '2026-01-01',
    };

    const pub = toPublicPerson(samplePerson);

    // Appearance should have public fields but weightKg is NOT in PublicPerson type
    expect(pub.appearance?.heightCm).toBe(180);
    expect(pub.appearance?.hairColor).toBe('Black');
    expect((pub.appearance as Record<string, unknown>).weightKg).toBeUndefined();

    // Gallery visibility was PRIVATE -> gallery is empty array in public view
    expect(pub.gallery).toEqual([]);

    // SocialAccounts was PUBLIC -> preserved
    expect(pub.socialAccounts.length).toBe(1);
  });
});
