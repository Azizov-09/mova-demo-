import type { Person, Category, SearchFilters, SearchResult, PersonCategory } from '@/types';

export interface PeopleRepository {
  getAll(): Promise<Person[]>;
  getBySlug(slug: string): Promise<Person | null>;
  getFeatured(limit?: number): Promise<Person[]>;
  search(filters: SearchFilters, page?: number, limit?: number): Promise<SearchResult>;
  getByCategory(category: PersonCategory, limit?: number): Promise<Person[]>;
  getRelated(person: Person, limit?: number): Promise<Person[]>;
}

export interface CategoriesRepository {
  getAll(): Promise<Category[]>;
  getById(id: PersonCategory): Promise<Category | null>;
}

export interface ClaimsRepository {
  submit(request: import('@/types').ClaimRequest): Promise<import('@/types').ClaimSubmissionResult>;
}
