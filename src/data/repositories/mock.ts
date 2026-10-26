import type { Person, Category, SearchFilters, SearchResult, PersonCategory, ClaimRequest, ClaimSubmissionResult } from '@/types';
import { mockPeople, mockCategories } from '@/data/mock/people';
import type { PeopleRepository, CategoriesRepository, ClaimsRepository } from './contracts';

// ============================================================
// MOCK PEOPLE REPOSITORY
// ============================================================

export class MockPeopleRepository implements PeopleRepository {
  private people: Person[] = mockPeople;

  async getAll(): Promise<Person[]> {
    return this.people;
  }

  async getBySlug(slug: string): Promise<Person | null> {
    return this.people.find(p => p.slug === slug) ?? null;
  }

  async getFeatured(limit = 6): Promise<Person[]> {
    return [...this.people]
      .filter(p => p.featuredOrder !== undefined)
      .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))
      .slice(0, limit);
  }

  async search(filters: SearchFilters, page = 1, limit = 12): Promise<SearchResult> {
    let results = [...this.people];

    // Text search
    if (filters.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(
        p =>
          p.fullName.toLowerCase().includes(q) ||
          p.professionalTitle.toLowerCase().includes(q) ||
          p.shortBio.toLowerCase().includes(q) ||
          p.publicLocation?.toLowerCase().includes(q),
      );
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      results = results.filter(p =>
        filters.categories!.some(cat => p.categories.includes(cat)),
      );
    }

    // Location filter
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      results = results.filter(p => p.publicLocation?.toLowerCase().includes(loc));
    }

    // Verified only
    if (filters.verifiedOnly) {
      results = results.filter(p => p.verificationStatus === 'VERIFIED');
    }

    // Sort
    switch (filters.sortBy) {
      case 'name':
        results.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      case 'updated':
        results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'featured':
      default:
        results.sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
        break;
    }

    const total = results.length;
    const start = (page - 1) * limit;
    const paginated = results.slice(start, start + limit);

    return {
      people: paginated,
      total,
      hasMore: start + limit < total,
      page,
    };
  }

  async getByCategory(category: PersonCategory, limit = 10): Promise<Person[]> {
    return this.people.filter(p => p.categories.includes(category)).slice(0, limit);
  }

  async getRelated(person: Person, limit = 4): Promise<Person[]> {
    return this.people
      .filter(
        p =>
          p.id !== person.id &&
          p.categories.some(cat => person.categories.includes(cat)),
      )
      .slice(0, limit);
  }
}

// ============================================================
// MOCK CATEGORIES REPOSITORY
// ============================================================

export class MockCategoriesRepository implements CategoriesRepository {
  private categories: Category[] = mockCategories;

  async getAll(): Promise<Category[]> {
    return this.categories;
  }

  async getById(id: PersonCategory): Promise<Category | null> {
    return this.categories.find(c => c.id === id) ?? null;
  }
}

// ============================================================
// MOCK CLAIMS REPOSITORY
// ============================================================

export class MockClaimsRepository implements ClaimsRepository {
  async submit(request: ClaimRequest): Promise<ClaimSubmissionResult> {
    void request;
    // Simulate async processing delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Demo: always returns a pending confirmation (not verified)
    return {
      success: true,
      referenceId: `MOVA-CLAIM-${Date.now().toString(36).toUpperCase()}`,
      message:
        'Your claim request has been received. Our team will review your submission and contact you within 5-7 business days. This is a demo environment — no actual verification is performed.',
    };
  }
}

// ============================================================
// SINGLETON INSTANCES
// ============================================================

export const peopleRepository = new MockPeopleRepository();
export const categoriesRepository = new MockCategoriesRepository();
export const claimsRepository = new MockClaimsRepository();
