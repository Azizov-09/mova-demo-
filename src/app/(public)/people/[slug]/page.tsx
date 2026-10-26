import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { mockPeople } from '@/data/mock/people';
import PersonDetailClient from './_client';

export function generateStaticParams() {
  return mockPeople.map((person) => ({
    slug: person.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const person = mockPeople.find((p) => p.slug === slug);

  if (!person) {
    return {
      title: 'Person Not Found | MOVA',
    };
  }

  return {
    title: `${person.fullName} — ${person.professionalTitle}`,
    description: person.shortBio,
  };
}

async function PersonContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = mockPeople.find((p) => p.slug === slug);

  if (!person) {
    notFound();
  }

  return <PersonDetailClient person={person} />;
}

export default function PersonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PersonContent params={params} />
    </Suspense>
  );
}
