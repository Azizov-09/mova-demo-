import { Suspense } from 'react';
import { UserView } from '@/components/dashboard/UserView';

async function UserSubContent({
  params,
}: {
  params: Promise<{ tab: string }>;
}) {
  const { tab } = await params;
  return <UserView initialTab={tab} />;
}

export default function UserSubPage({
  params,
}: {
  params: Promise<{ tab: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[var(--text-tertiary)]">Loading portal...</div>}>
      <UserSubContent params={params} />
    </Suspense>
  );
}
