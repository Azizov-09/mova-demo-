import { Suspense } from 'react';
import { AdminView } from '@/components/dashboard/AdminView';

async function AdminSubContent({
  params,
}: {
  params: Promise<{ tab: string }>;
}) {
  const { tab } = await params;
  return <AdminView key={tab} initialTab={tab} />;
}

export default function AdminSubPage({
  params,
}: {
  params: Promise<{ tab: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[var(--text-tertiary)]">Loading admin desk...</div>}>
      <AdminSubContent params={params} />
    </Suspense>
  );
}
