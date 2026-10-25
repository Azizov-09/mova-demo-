import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Lock, Eye, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & Data Transparency — MOVA',
  description:
    'Learn how MOVA handles data privacy, visibility controls, source attribution, and personal data rights.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="container-mova max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] text-[var(--accent-primary)] text-caption font-mono uppercase tracking-wider mb-4">
            <Shield size={14} />
            Data Transparency & Ethics
          </div>
          <h1 className="text-display-md md:text-display-lg font-bold text-[var(--text-primary)] mb-4">
            Privacy Policy & <span className="gradient-text">Visibility Controls</span>
          </h1>
          <p className="text-body-md text-[var(--text-secondary)]">
            Last updated: October 2026. At MOVA, human dignity and data autonomy are at the core of our platform architecture.
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-12">
          {/* Section 1: Philosophy */}
          <section className="p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Eye size={20} className="text-[var(--accent-primary)]" />
              1. Our Data Philosophy: Privacy-First Architecture
            </h2>
            <p className="text-body-sm text-[var(--text-secondary)] leading-relaxed">
              MOVA is a curated directory celebrating human achievement. Unlike traditional social networks that monetize non-consensual tracking and behavioral surveillance, MOVA operates on an explicit, transparent taxonomy. We collect and present only relevant professional achievements, public biographical information, and verified milestones.
            </p>
          </section>

          {/* Section 2: Visibility Levels */}
          <section className="p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Lock size={20} className="text-[var(--accent-primary)]" />
              2. Explicit Field-Level Visibility Controls
            </h2>
            <p className="text-body-sm text-[var(--text-secondary)] leading-relaxed">
              Every profile on MOVA adheres to strict field-level visibility controls. Sensitive data fields never bleed into public API endpoints:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-1">
                  Appearance & Biometrics
                </h3>
                <p className="text-caption text-[var(--text-tertiary)] leading-relaxed">
                  Weight metrics default strictly to <code>PRIVATE</code>. Height, hair color, and eye color are only displayed when explicitly verified and designated as <code>PUBLIC</code> by the individual.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-1">
                  Activity & Location
                </h3>
                <p className="text-caption text-[var(--text-tertiary)] leading-relaxed">
                  Current activities and public locations are broad city/regional indicators. Precise GPS, real-time geolocations, and private residences are strictly prohibited.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-1">
                  Source Attribution
                </h3>
                <p className="text-caption text-[var(--text-tertiary)] leading-relaxed">
                  Every data point is tagged with its provenance: <code>SELF_REPORTED</code>, <code>PUBLIC_SOURCE</code>, or <code>VERIFIED_SOURCE</code>.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-1">
                  Galleries & Media
                </h3>
                <p className="text-caption text-[var(--text-tertiary)] leading-relaxed">
                  Only images with verified public domain, Creative Commons, or authorized press licenses are displayed.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Right to Claim & Opt-Out */}
          <section className="p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              3. Claiming Ownership and Opt-Out Rights
            </h2>
            <p className="text-body-sm text-[var(--text-secondary)] leading-relaxed">
              If a profile has been created for you or your client using publicly available biographical sources, you have absolute ownership rights:
            </p>
            <ul className="space-y-2 text-body-sm text-[var(--text-secondary)] pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <span><strong>Claim:</strong> Verify your identity via our <Link href="/claim" className="text-[var(--accent-primary)] hover:underline">Claim Portal</Link> to take full editorial management of your profile.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <span><strong>Hide / Delist:</strong> Switch your profile visibility to <code>HIDDEN</code> to remove it from public search and indexation.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <span><strong>Permanent Deletion:</strong> Request complete permanent purging of all profile records and associated media from our databases.</span>
              </li>
            </ul>
          </section>

          {/* Section 4: Security & Cookies */}
          <section className="p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              4. Security Measures & Minimalist Cookies
            </h2>
            <p className="text-body-sm text-[var(--text-secondary)] leading-relaxed">
              We employ HTTPS/TLS 1.3 encryption across all communication, CSRF tokens, strict Content Security Policy headers, and rate limiting. We do not use third-party invasive ad tracking cookies. Local storage is strictly utilized for user interface preferences such as dark/light theme choice and command palette histories.
            </p>
          </section>

          {/* Action CTA */}
          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-between items-center p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
            <div>
              <h3 className="font-bold text-[var(--text-primary)] text-sm mb-1">
                Have questions regarding your personal data?
              </h3>
              <p className="text-caption text-[var(--text-tertiary)]">
                Our privacy team responds to all data subject requests within 48 business hours.
              </p>
            </div>
            <Link href="/claim" className="btn btn-primary whitespace-nowrap text-sm">
              Submit a Claim / Request
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
