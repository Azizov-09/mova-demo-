import { Suspense } from 'react';
import { SuperAdminView } from '@/components/dashboard/SuperAdminView';

async function SuperAdminSubContent({
  params,
}: {
  params: Promise<{ tab: string }>;
}) {
  const { tab } = await params;
  return <SuperAdminView initialTab={tab} />;
}

export default function SuperAdminSubPage({
  params,
}: {
  params: Promise<{ tab: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[var(--text-tertiary)]">Loading console...</div>}>
      <SuperAdminSubContent params={params} />
    </Suspense>
  );
}
