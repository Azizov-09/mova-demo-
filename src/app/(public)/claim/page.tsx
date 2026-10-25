import type { Metadata } from 'next';
import { Suspense } from 'react';
import ClaimProfileClient from './_client';

export const metadata: Metadata = {
  title: 'Claim Your Profile — MOVA Verification',
  description:
    'Claim and verify your profile on MOVA. Update your story, customize visibility, and establish authentic presence.',
};

export default function ClaimPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ClaimProfileClient />
    </Suspense>
  );
}
