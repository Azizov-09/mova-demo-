import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Compass, Users, Sparkles, Filter } from 'lucide-react';
import { mockCategories, mockPeople } from '@/data/mock/people';

export const metadata: Metadata = {
  title: 'Categories — Explore Disciplines & Fields',
  description:
    'Browse MOVA categories to discover influential figures, artists, innovators, and thinkers across diverse industries.',
};

export default function CategoriesPage() {
  return (
    <div className="min-h-screen pt-28 pb-24">
      {/* Hero Header */}
      <section className="container-mova mb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] text-[var(--accent-primary)] text-caption font-mono uppercase tracking-wider mb-5">
            <Sparkles size={14} />
            Taxonomy & Fields
          </div>
          <h1 className="text-display-lg md:text-display-xl font-bold tracking-tight text-[var(--text-primary)] mb-6">
            Explore People by <span className="gradient-text">Discipline</span>
          </h1>
          <p className="text-body-lg text-[var(--text-secondary)] leading-relaxed">
            From jazz pioneers and visionary founders to aerospace researchers and world-class athletes.
            Browse our curated directories categorized across nine creative and scientific domains.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container-mova">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCategories.map((category, index) => {
            const peopleInCategory = mockPeople.filter(p => p.categories.includes(category.id));
            const count = peopleInCategory.length;

            return (
              <div
                key={category.id}
                className="group relative rounded-3xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-elevated)] transition-all duration-300 hover:border-[var(--border-default)] hover:shadow-2xl hover:-translate-y-1.5 flex flex-col justify-between"
              >
                {/* Visual Cover Banner */}
                <div className="relative h-48 w-full overflow-hidden bg-[var(--bg-card)]">
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-elevated)] via-[var(--bg-elevated)]/40 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md"
                      style={{
                        backgroundColor: 'rgba(11, 13, 18, 0.75)',
                        color: category.accentColor,
                        border: `1px solid ${category.accentColor}33`,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category.accentColor }}
                      />
                      {count} {count === 1 ? 'Profile' : 'Profiles'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent-primary)] transition-colors">
                      {category.name}
                    </h2>
                    <p className="text-body-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-6">
                      {category.description}
                    </p>
                  </div>

                  {/* Previews & Link */}
                  <div>
                    {/* Top profiles avatar stack */}
                    {peopleInCategory.length > 0 && (
                      <div className="mb-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                        <div className="flex items-center -space-x-2">
                          {peopleInCategory.slice(0, 3).map(person => (
                            <div
                              key={person.id}
                              className="relative w-8 h-8 rounded-full border-2 border-[var(--bg-elevated)] overflow-hidden bg-[var(--bg-card)]"
                              title={person.fullName}
                            >
                              <Image
                                src={person.avatarUrl}
                                alt={person.fullName}
                                fill
                                className="object-cover"
                                sizes="32px"
                              />
                            </div>
                          ))}
                          {peopleInCategory.length > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-[var(--bg-elevated)] bg-[var(--bg-card)] flex items-center justify-center text-[10px] font-mono text-[var(--text-secondary)]">
                              +{peopleInCategory.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-caption text-[var(--text-tertiary)]">
                          Featured minds
                        </span>
                      </div>
                    )}

                    <Link
                      href={`/explore?category=${category.id}`}
                      className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-[var(--surface-hover)] text-[var(--text-primary)] font-medium text-sm group-hover:bg-[var(--accent-primary)] group-hover:text-[#0B0D12] transition-all duration-200"
                    >
                      <span>Explore {category.name}</span>
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Discovery CTA */}
      <section className="container-mova mt-20">
        <div className="p-8 md:p-12 rounded-3xl border border-[var(--border-subtle)] bg-gradient-to-r from-[var(--bg-elevated)] to-[var(--bg-card)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              Looking for someone specific?
            </h3>
            <p className="text-[var(--text-secondary)] text-sm md:text-base">
              Use our live search engine with filters for location, verification status, and discipline.
            </p>
          </div>
          <Link href="/explore" className="btn btn-primary whitespace-nowrap">
            <Compass size={18} />
            Search All Profiles
          </Link>
        </div>
      </section>
    </div>
  );
}
