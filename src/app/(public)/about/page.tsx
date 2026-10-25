import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Compass, Shield, Sparkles, Eye, Users, Globe2, HeartHandshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About MOVA — Discover People. Explore Their Stories.',
  description:
    'MOVA is a human-centered discovery platform celebrating the lives, journeys, achievements, and creative impact of remarkable individuals worldwide.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28 pb-24">
      {/* Hero Section */}
      <section className="container-mova mb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] text-[var(--accent-primary)] text-caption font-mono uppercase tracking-wider mb-5">
            <Sparkles size={14} />
            The MOVA Manifesto
          </div>
          <h1 className="text-display-lg md:text-display-xl font-bold tracking-tight text-[var(--text-primary)] mb-6 leading-tight">
            Connecting Humanity Through <span className="gradient-text">Authentic Stories</span>
          </h1>
          <p className="text-body-lg text-[var(--text-secondary)] leading-relaxed">
            The internet has plenty of search engines for companies, code repositories, and videos.
            Yet finding the human beings behind monumental innovations, transformative melodies, and bold
            ventures has always been fragmented across endless noise.
          </p>
        </div>
      </section>

      {/* Visual Editorial Grid */}
      <section className="container-mova mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative h-96 md:h-[480px] rounded-3xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop&q=80"
              alt="MOVA collaboration and storytelling"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[var(--bg-elevated)]/85 backdrop-blur-md border border-[var(--border-subtle)]">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Humanity over Algorithms
              </p>
              <p className="text-caption text-[var(--text-secondary)]">
                Every profile is an authentic tapestry of dedication, struggles, and milestones.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-display-sm md:text-display-md font-bold text-[var(--text-primary)]">
              We believe every journey deserves an intentional stage.
            </h2>
            <p className="text-body-md text-[var(--text-secondary)] leading-relaxed">
              MOVA is built as a digital museum of living human accomplishment. We combine deep editorial
              structure with cinematic interactive design to honor people across artistic, scientific, and
              athletic pursuits.
            </p>
            <p className="text-body-md text-[var(--text-secondary)] leading-relaxed">
              Whether you are an aspiring student looking for mentorship blueprints, a curator scouting
              visionary minds, or a founder seeking like-minded pioneers, MOVA provides the lens to discover them.
            </p>
            <div className="pt-2">
              <Link href="/explore" className="btn btn-primary">
                <Compass size={18} />
                Explore the Directory
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="container-mova mb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-display-md font-bold text-[var(--text-primary)] mb-4">
            Our Guiding Pillars
          </h2>
          <p className="text-body-md text-[var(--text-secondary)]">
            The design and engineering principles behind every pixel of the MOVA ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Shield,
              title: 'Privacy by Design',
              desc: 'Explicit visibility controls. Sensitive metrics default to private, with full ownership in the hands of individuals.',
            },
            {
              icon: Sparkles,
              title: 'Cinematic Craft',
              desc: 'High-aesthetic typography, subtle glassmorphism, responsive motion tokens, and zero generic boilerplate.',
            },
            {
              icon: Globe2,
              title: 'Cross-Disciplinary',
              desc: 'Connecting developers with jazz musicians, scientists with Olympic champions, creating unexpected cross-pollination.',
            },
            {
              icon: HeartHandshake,
              title: 'Verifiable Truth',
              desc: 'Rigorous community and editorial verification ensuring citations, public attributions, and transparent timelines.',
            },
          ].map((pillar, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:border-[var(--accent-primary)]/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent-dim)] text-[var(--accent-primary)] flex items-center justify-center mb-6">
                <pillar.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                {pillar.title}
              </h3>
              <p className="text-body-sm text-[var(--text-secondary)] leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call */}
      <section className="container-mova">
        <div className="p-8 md:p-14 rounded-3xl border border-[var(--border-subtle)] bg-gradient-to-r from-[var(--bg-elevated)] via-[var(--bg-card)] to-[var(--bg-elevated)] text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4">
            Are you ready to share your story?
          </h2>
          <p className="text-[var(--text-secondary)] mb-8 text-sm md:text-base leading-relaxed">
            Claim your existing profile or nominate a creator who inspires your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/claim" className="btn btn-primary">
              Claim Your Profile
              <ArrowRight size={16} />
            </Link>
            <Link href="/categories" className="btn btn-secondary">
              Browse Categories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
