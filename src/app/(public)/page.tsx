'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  Search,
  ArrowRight,
  CheckCircle,
  Compass,
  Sparkles,
  TrendingUp,
  Users,
  Globe,
} from 'lucide-react';
import { mockPeople, mockCategories } from '@/data/mock/people';
import { PersonCard } from '@/components/people/PersonCard';
import { cn } from '@/lib/utils';

// ============================================================
// HERO SECTION
// ============================================================

type FloatingPortraitProps = {
  person: (typeof mockPeople)[number];
  index: number;
  position: {
    top: string;
    left?: string;
    right?: string;
    width: string;
    delay: number;
  };
  visible: boolean;
};

function FloatingPortrait({ person, index, position, visible }: FloatingPortraitProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = person.fullName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={visible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.8,
        delay: position.delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="absolute overflow-hidden rounded-2xl border border-[var(--border-subtle)] shadow-[var(--mova-shadow-lg)]"
      style={{
        top: position.top,
        left: position.left,
        right: position.right,
        width: position.width,
        aspectRatio: '3/4',
        background: 'var(--bg-card)',
      }}
    >
      {imageFailed ? (
        <div className="flex h-full w-full items-center justify-center bg-[var(--bg-card)]">
          <span
            className="text-5xl font-black text-[var(--text-tertiary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {initials}
          </span>
        </div>
      ) : (
        <Image
          src={person.avatarUrl}
          alt={person.fullName}
          fill
          className="object-cover"
          sizes="20vw"
          priority={index < 3}
          onError={() => setImageFailed(true)}
        />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B0D12]/90 to-transparent p-3">
        <div className="mb-0.5 flex items-center gap-1">
          <p className="truncate text-xs font-semibold text-white">{person.fullName}</p>
          {person.verificationStatus === 'VERIFIED' && (
            <CheckCircle size={10} style={{ color: '#22c55e', flexShrink: 0 }} />
          )}
        </div>
        <p className="truncate text-[10px] text-white/60">{person.professionalTitle}</p>
      </div>
    </motion.div>
  );
}

function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [heroLoaded, setHeroLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/explore');
    }
  };

  const heroWords = ['Discover', 'People.'];
  const heroWords2 = ['Explore', 'Their', 'Stories.'];

  const featuredPeople = mockPeople.slice(0, 4);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{
        background: 'var(--bg-base)',
      }}
      aria-label="Hero — MOVA People Discovery"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 right-0 h-[70vh]"
          style={{
            background: 'radial-gradient(ellipse 100% 60% at 50% -5%, rgba(199, 255, 97, 0.07) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-64"
          style={{
            background: 'linear-gradient(to top, var(--bg-base), transparent)',
          }}
        />
      </div>

      {/* Floating Portrait Grid */}
      <motion.div
        style={{ y }}
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] overflow-hidden xl:block"
        aria-hidden="true"
      >
        <div className="relative h-full w-full">
          {/* Portrait cards arranged in offset grid */}
          {featuredPeople.map((person, i) => {
            const positions = [
              { top: '9%', left: '4%', width: '43%', delay: 0.5 },
              { top: '6%', right: '-4%', width: '40%', delay: 0.65 },
              { top: '48%', left: '10%', width: '38%', delay: 0.8 },
              { top: '43%', right: '5%', width: '39%', delay: 0.72 },
            ];
            const pos = positions[i];
            if (!pos) return null;

            return (
              <FloatingPortrait
                key={person.id}
                person={person}
                index={i}
                position={pos}
                visible={heroLoaded}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Content */}
      <div className="container-mova relative z-10 pt-20 pb-32">
        <div className="max-w-2xl xl:max-w-[54%] 2xl:max-w-3xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2 mb-8"
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--accent-primary)' }}
            />
            <span className="text-eyebrow" style={{ color: 'var(--accent-primary)' }}>
              People Discovery Platform
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-display-xl mb-6 leading-none" aria-label="Discover People. Explore Their Stories.">
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: '100%' }}
                animate={heroLoaded ? { y: '0%' } : {}}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {heroWords.map((word) => (
                  <span
                    key={word}
                    className={cn(
                      'inline-block mr-4',
                      word === 'People.' && 'text-[var(--accent-primary)]'
                    )}
                  >
                    {word}
                  </span>
                ))}
              </motion.div>
            </div>
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: '100%' }}
                animate={heroLoaded ? { y: '0%' } : {}}
                transition={{ duration: 0.7, delay: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {heroWords2.map((word) => (
                  <span key={word} className="inline-block mr-4">
                    {word}
                  </span>
                ))}
              </motion.div>
            </div>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-body-lg text-[var(--text-secondary)] max-w-lg mb-10"
          >
            One platform to understand anyone — their background, career, achievements, and what they&apos;re working on right now.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.75 }}
          >
            <form onSubmit={handleSearch} role="search" aria-label="Search for people">
              <div className="flex items-center gap-3 p-2 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-[var(--mova-shadow-md)] max-w-xl">
                <div className="flex items-center gap-3 flex-1 px-2">
                  <Search size={18} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                  <input
                    type="search"
                    placeholder="Search by name, profession, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none text-base py-2"
                    aria-label="Search for people"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary rounded-xl shrink-0"
                  style={{ padding: '10px 20px' }}
                >
                  <span className="hidden sm:inline">Explore</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>

            {/* Quick category shortcuts */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-caption text-[var(--text-tertiary)]">Try:</span>
              {['Musicians', 'Entrepreneurs', 'Scientists', 'Athletes'].map(cat => (
                <Link
                  key={cat}
                  href={`/explore?q=${cat.toLowerCase()}`}
                  className="text-caption px-3 py-1 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all duration-150"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-wrap items-center gap-6 mt-12"
          >
            {[
              { icon: Users, label: `${mockPeople.length} Demo Profiles` },
              { icon: Globe, label: `${mockCategories.length} Categories` },
              { icon: CheckCircle, label: 'Verified Profiles' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={14} style={{ color: 'var(--text-tertiary)' }} />
                <span className="text-caption text-[var(--text-secondary)]">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={heroLoaded ? { opacity: 1 } : {}}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-0.5 h-8 rounded-full"
          style={{ background: 'linear-gradient(to bottom, var(--accent-primary), transparent)' }}
        />
      </motion.div>
    </section>
  );
}

// ============================================================
// SECTION HEADER COMPONENT
// ============================================================

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
      <div className="max-w-xl">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-eyebrow mb-3"
            style={{ color: 'var(--accent-primary)' }}
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-h1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-body-md text-[var(--text-secondary)] mt-3"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      {action && (
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Link
            href={action.href}
            className="btn btn-secondary group"
          >
            {action.label}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}

// ============================================================
// FEATURED PEOPLE SECTION
// ============================================================

function FeaturedPeopleSection() {
  const featured = mockPeople.slice(0, 6);

  return (
    <section className="section-padding" aria-labelledby="featured-heading">
      <div className="container-mova">
        <SectionHeader
          eyebrow="Featured Profiles"
          title="Meet Exceptional People"
          subtitle="Illustrative profiles spanning music, technology, science, sport, and entrepreneurship."
          action={{ label: 'See All Profiles', href: '/explore' }}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((person, i) => (
            <PersonCard key={person.id} person={person} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// EXPLORE CATEGORIES SECTION
// ============================================================

function ExploreCategoriesSection() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section
      className="section-padding"
      style={{ background: 'var(--bg-elevated)' }}
      aria-labelledby="categories-heading"
    >
      <div className="container-mova">
        <SectionHeader
          eyebrow="Discover by Field"
          title="Explore Categories"
          subtitle="Find people in the field you care about most."
          action={{ label: 'All Categories', href: '/categories' }}
        />
        <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mockCategories.map((cat, i) => (
            <CategoryTile key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryTile({
  category,
  index,
}: {
  category: typeof mockCategories[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.05 }}
    >
      <Link
        href={`/explore?category=${category.id}`}
        className="group relative flex flex-col rounded-2xl overflow-hidden border border-[var(--border-subtle)] aspect-square hover:border-[var(--border-default)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--mova-shadow-md)]"
        style={{ background: 'var(--bg-card)' }}
        aria-label={`Explore ${category.name}`}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            className="object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)]/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end h-full p-4">
          <h3
            className="font-bold text-sm leading-tight mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            {category.name}
          </h3>
          <p className="text-[10px] text-[var(--text-tertiary)]">
            {category.profileCount > 0 ? `${category.profileCount} profiles` : 'Profiles'}
          </p>
        </div>

        {/* Accent corner */}
        <div
          className="absolute top-3 right-3 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: category.accentColor }}
        />
      </Link>
    </motion.div>
  );
}

// ============================================================
// HOW MOVA WORKS
// ============================================================

function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Discover a Person',
      description: 'Search by name, profession, or browse categories to find someone inspiring.',
      icon: Search,
    },
    {
      number: '02',
      title: 'Explore Their Story',
      description: 'Read their biography, career timeline, and what makes them remarkable.',
      icon: Compass,
    },
    {
      number: '03',
      title: 'View Achievements',
      description: 'Discover their projects, milestones, and public social presence.',
      icon: TrendingUp,
    },
    {
      number: '04',
      title: 'Claim Your Profile',
      description: 'Are you in the directory? Submit a claim to manage your own profile.',
      icon: CheckCircle,
    },
  ];

  return (
    <section className="section-padding" aria-labelledby="how-it-works-heading">
      <div className="container-mova">
        <SectionHeader
          eyebrow="How It Works"
          title="Your Discovery Journey"
          subtitle="MOVA answers three questions about every person: Who are they? What have they achieved? What are they doing now?"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} i={i} total={steps.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  i,
  total,
}: {
  step: { number: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; title: string; description: string };
  i: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: i * 0.1 }}
      className="relative p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]"
    >
      {/* Step number */}
      <div
        className="text-5xl font-black mb-4 leading-none"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--border-strong)',
          WebkitTextStroke: '1px var(--border-strong)',
        }}
      >
        {step.number}
      </div>

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ background: 'var(--accent-dim)' }}
      >
        <step.icon size={18} style={{ color: 'var(--accent-primary)' }} />
      </div>

      <h3
        className="text-h3 mb-2"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
      >
        {step.title}
      </h3>
      <p className="text-body-sm text-[var(--text-secondary)]">
        {step.description}
      </p>

      {/* Connector line (not last) */}
      {i < total - 1 && (
        <div
          className="hidden lg:block absolute top-8 -right-3 w-6 h-px"
          style={{ background: 'var(--border-subtle)' }}
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
}

// ============================================================
// EDITORIAL STORYTELLING SECTION
// ============================================================

function StoriesSection() {
  const person = mockPeople[0]; // Aiko Nakamura
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="section-padding overflow-hidden"
      style={{ background: 'var(--bg-elevated)' }}
      aria-labelledby="stories-heading"
    >
      <div className="container-mova">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <Image
                src={person.coverImageUrl}
                alt={`${person.fullName} cover`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, var(--bg-elevated)/70 0%, transparent 60%)' }}
              />
            </div>

            {/* Floating achievement card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -bottom-6 -right-6 p-4 rounded-2xl border border-[var(--border-default)] shadow-[var(--mova-shadow-lg)]"
              style={{ background: 'var(--bg-card)', maxWidth: '200px' }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'var(--accent-dim)' }}
                >
                  <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-primary)] leading-tight mb-1">
                    Grammy Nomination
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)]">Best World Music Album</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-eyebrow mb-4" style={{ color: 'var(--accent-primary)' }}>
              Deep Profile Stories
            </p>
            <h2
              className="text-display-lg mb-6"
              id="stories-heading"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Beyond the highlights
            </h2>
            <p className="text-body-lg text-[var(--text-secondary)] mb-6">
              Every profile on MOVA tells a complete story — not just what someone achieved,
              but how they got there, what drives them, and what they&apos;re doing next.
            </p>
            <div className="space-y-4 mb-8">
              {[
                { label: 'Biography', desc: 'Detailed background and life story' },
                { label: 'Career Timeline', desc: 'Chronological journey of milestones' },
                { label: 'Achievements', desc: 'Notable recognitions and accomplishments' },
                { label: 'Current Activity', desc: 'What they\'re working on right now' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                    style={{ background: 'var(--accent-primary)' }}
                  />
                  <div>
                    <span className="font-semibold text-sm text-[var(--text-primary)]">{item.label}: </span>
                    <span className="text-sm text-[var(--text-secondary)]">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href={`/people/${person.slug}`}
              className="btn btn-primary btn-lg group"
            >
              Read {person.fullName.split(' ')[0]}&apos;s Story
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FINAL CTA
// ============================================================

function FinalCTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="section-padding relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(199, 255, 97, 0.05) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="container-mova relative z-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-eyebrow mb-6"
          style={{ color: 'var(--accent-primary)' }}
        >
          Start Your Discovery
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-display-lg mb-6 max-w-3xl mx-auto"
          id="cta-heading"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Every person has a story worth discovering.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-body-lg text-[var(--text-secondary)] mb-10 max-w-xl mx-auto"
        >
          Explore careers, achievements, and the journeys of fascinating people from every field.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/explore" className="btn btn-primary btn-lg group">
            Explore People
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/claim" className="btn btn-secondary btn-lg">
            Claim Your Profile
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// PAGE EXPORT
// ============================================================

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedPeopleSection />
      <ExploreCategoriesSection />
      <StoriesSection />
      <HowItWorksSection />
      <FinalCTASection />
    </>
  );
}
