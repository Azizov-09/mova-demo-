import type { Metadata } from 'next';
import { Suspense } from 'react';
import ExploreClient from './_client';

export const metadata: Metadata = {
  title: 'Explore People',
  description:
    'Browse and discover fascinating people — artists, entrepreneurs, athletes, scientists, and more — on MOVA.',
};

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
          <div className="container-mova py-20">
            <div className="skeleton h-12 w-64 mb-4 rounded-xl" />
            <div className="skeleton h-5 w-40 mb-10 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton aspect-portrait rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ExploreClient />
    </Suspense>
  );
}
