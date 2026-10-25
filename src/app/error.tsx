'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors
    console.error('MOVA Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
      <div className="container-mova max-w-lg text-center p-8 md:p-12 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-6">
          <AlertOctagon size={32} />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3">
          Something went wrong
        </h1>

        <p className="text-body-sm text-[var(--text-secondary)] mb-8 leading-relaxed">
          An unexpected error occurred while rendering this view. Our telemetry has captured this event.
        </p>

        {error.digest && (
          <div className="mb-6 px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-tertiary)]">
            Digest: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => reset()} className="btn btn-primary">
            <RotateCcw size={16} />
            Try Again
          </button>
          <Link href="/" className="btn btn-secondary">
            <Home size={16} />
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
