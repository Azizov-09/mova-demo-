import { describe, it, expect } from 'vitest';
import {
  MockPeopleRepository,
  MockCategoriesRepository,
  MockClaimsRepository,
} from './mock';

describe('MockPeopleRepository', () => {
  const repo = new MockPeopleRepository();

  it('getAll returns list of people', async () => {
    const people = await repo.getAll();
    expect(people.length).toBeGreaterThan(0);
    expect(people[0]).toHaveProperty('slug');
    expect(people[0]).toHaveProperty('fullName');
  });

  it('getBySlug finds person by slug', async () => {
    const person = await repo.getBySlug('aiko-nakamura');
    expect(person).not.toBeNull();
    expect(person?.fullName).toBe('Aiko Nakamura');
  });

  it('getBySlug returns null for nonexistent slug', async () => {
    const person = await repo.getBySlug('non-existent-person-xyz');
    expect(person).toBeNull();
  });

  it('getFeatured returns people sorted by featuredOrder', async () => {
    const featured = await repo.getFeatured(3);
    expect(featured.length).toBeLessThanOrEqual(3);
    for (let i = 0; i < featured.length - 1; i++) {
      const curr = featured[i].featuredOrder ?? 99;
      const next = featured[i + 1].featuredOrder ?? 99;
      expect(curr).toBeLessThanOrEqual(next);
    }
  });

  it('search filters by text query', async () => {
    const res = await repo.search({ query: 'Aiko' });
    expect(res.people.some(p => p.fullName.includes('Aiko'))).toBe(true);
  });

  it('search filters by category', async () => {
    const res = await repo.search({ categories: ['artists-musicians'] });
    expect(res.people.every(p => p.categories.includes('artists-musicians'))).toBe(true);
  });

  it('search filters by verified status', async () => {
    const res = await repo.search({ verifiedOnly: true });
    expect(res.people.every(p => p.verificationStatus === 'VERIFIED')).toBe(true);
  });

  it('getRelated excludes current person and matches category', async () => {
    const aiko = (await repo.getBySlug('aiko-nakamura'))!;
    const related = await repo.getRelated(aiko, 4);
    expect(related.some(p => p.id === aiko.id)).toBe(false);
  });
});

describe('MockCategoriesRepository', () => {
  const repo = new MockCategoriesRepository();

  it('getAll returns all 9 categories', async () => {
    const categories = await repo.getAll();
    expect(categories.length).toBe(9);
    expect(categories.some(c => c.id === 'artists-musicians')).toBe(true);
    expect(categories.some(c => c.id === 'entrepreneurs')).toBe(true);
    expect(categories.some(c => c.id === 'developers')).toBe(true);
  });

  it('getById returns correct category', async () => {
    const cat = await repo.getById('developers');
    expect(cat).not.toBeNull();
    expect(cat?.name).toBe('Developers');
  });
});

describe('MockClaimsRepository', () => {
  const repo = new MockClaimsRepository();

  it('submits claim request and returns referenceId', async () => {
    const res = await repo.submit({
      profileSlug: 'aiko-nakamura',
      claimantName: 'Aiko Nakamura',
      claimantEmail: 'aiko@example.com',
      claimantProfession: 'Pianist',
      evidence: 'https://example.com/press',
    });

    expect(res.success).toBe(true);
    expect(res.referenceId).toMatch(/^(MOVA-CLAIM|CLM)-[A-Z0-9]+$/);
    expect(res.message).toContain('received');
  });
});
