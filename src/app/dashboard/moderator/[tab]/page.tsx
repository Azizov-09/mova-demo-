import { Suspense } from 'react';
import { ModeratorView } from '@/components/dashboard/ModeratorView';

async function ModeratorSubContent({
  params,
}: {
  params: Promise<{ tab: string }>;
}) {
  const { tab } = await params;
  return <ModeratorView key={tab} initialTab={tab} />;
}

export default function ModeratorSubPage({
  params,
}: {
  params: Promise<{ tab: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[var(--text-tertiary)]">Loading queue...</div>}>
      <ModeratorSubContent params={params} />
    </Suspense>
  );
}
