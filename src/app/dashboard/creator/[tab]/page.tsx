import { Suspense } from 'react';
import { CreatorView } from '@/components/dashboard/CreatorView';

async function CreatorSubContent({
  params,
}: {
  params: Promise<{ tab: string }>;
}) {
  const { tab } = await params;
  return <CreatorView key={tab} initialTab={tab} />;
}

export default function CreatorSubPage({
  params,
}: {
  params: Promise<{ tab: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[var(--text-tertiary)]">Loading studio...</div>}>
      <CreatorSubContent params={params} />
    </Suspense>
  );
}
