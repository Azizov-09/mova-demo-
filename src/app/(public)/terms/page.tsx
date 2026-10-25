import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — MOVA',
  description:
    'Terms of Service and ethical usage guidelines for MOVA discovery platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="container-mova max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] text-[var(--accent-primary)] text-caption font-mono uppercase tracking-wider mb-4">
            <FileText size={14} />
            Legal Agreement
          </div>
          <h1 className="text-display-md md:text-display-lg font-bold text-[var(--text-primary)] mb-4">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="text-body-md text-[var(--text-secondary)]">
            Effective as of October 2026. Please read these terms carefully before accessing or contributing to the MOVA platform.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10">
          <section className="p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              1. Acceptance of Terms
            </h2>
            <p className="text-body-sm text-[var(--text-secondary)] leading-relaxed">
              By accessing, browsing, or utilizing the MOVA platform, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you should discontinue using the platform immediately.
            </p>
          </section>

          <section className="p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              2. Nature of the Platform & Public Biographical Content
            </h2>
            <p className="text-body-sm text-[var(--text-secondary)] leading-relaxed">
              MOVA is an editorial discovery platform highlighting public figures, innovators, artists, and leaders. Data presented on MOVA is synthesized from public domain records, authorized press materials, and self-reported submissions from verified individuals.
            </p>
            <p className="text-body-sm text-[var(--text-secondary)] leading-relaxed">
              Profiles are provided for educational, inspirational, and informational discovery. MOVA does not endorse or guarantee the commercial suitability or continuous accuracy of third-party accomplishments.
            </p>
          </section>

          <section className="p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              3. Verification & Profile Claiming Rules
            </h2>
            <p className="text-body-sm text-[var(--text-secondary)] leading-relaxed">
              When claiming a profile, you certify that:
            </p>
            <ul className="space-y-2 text-body-sm text-[var(--text-secondary)] pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <span>You are the individual described in the profile or an officially authorized legal representative or talent agent.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <span>All submitted verification evidence, identity links, and credentials are authentic and unmanipulated.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <span>Impression, misrepresentation, or fraudulent profile claims will result in immediate suspension and potential legal action.</span>
              </li>
            </ul>
          </section>

          <section className="p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              4. Prohibited Conduct
            </h2>
            <p className="text-body-sm text-[var(--text-secondary)] leading-relaxed">
              Users agree not to:
            </p>
            <ul className="space-y-2 text-body-sm text-[var(--text-secondary)] pl-2">
              <li className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <span>Scrape, mass-harvest, or reverse-engineer profile data for malicious or automated spam databases.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <span>Submit defamatory, obscene, harassing, or hate-speech content in biography updates.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <span>Attempt to bypass field-level privacy protections or access hidden biometric data.</span>
              </li>
            </ul>
          </section>

          <section className="p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              5. Contact & Inquiries
            </h2>
            <p className="text-body-sm text-[var(--text-secondary)] leading-relaxed">
              For legal inquiries, intellectual property notices, or terms questions, contact our editorial council at <code className="text-[var(--accent-primary)]">legal@mova.global</code>.
            </p>
          </section>

          <div className="pt-4 flex justify-between items-center">
            <Link href="/" className="btn btn-secondary">
              Back to Homepage
            </Link>
            <Link href="/privacy" className="btn btn-ghost text-[var(--accent-primary)]">
              View Privacy Policy
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
