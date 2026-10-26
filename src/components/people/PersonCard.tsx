'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { cn, truncate } from '@/lib/utils';
import type { Person } from '@/types';

const categoryNames: Record<string, string> = {
  'artists-musicians': 'Artist & Musician',
  'actors-public-figures': 'Actor & Public Figure',
  'bloggers-creators': 'Creator',
  'athletes': 'Athlete',
  'entrepreneurs': 'Entrepreneur',
  'developers': 'Developer',
  'scientists-experts': 'Scientist',
  'business-leaders': 'Business Leader',
  'other-professionals': 'Professional',
};

interface PersonCardProps {
  person: Person;
  variant?: 'default' | 'compact' | 'featured';
  index?: number;
  className?: string;
}

export function PersonCard({
  person,
  variant = 'default',
  index = 0,
  className,
}: PersonCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const primaryCategory = person.categories[0];
  const categoryLabel = categoryNames[primaryCategory] ?? 'Professional';

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Link
          href={`/people/${person.slug}`}
          className={cn(
            'flex items-center gap-4 p-4 rounded-xl border border-[var(--border-subtle)]',
            'hover:bg-[var(--surface-hover)] hover:border-[var(--border-default)]',
            'transition-all duration-200 group',
            className
          )}
        >
          {/* Avatar */}
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[var(--bg-elevated)]">
            {!imgError ? (
              <Image
                src={person.avatarUrl}
                alt={`${person.fullName} profile photo`}
                fill
                className="object-cover"
                onError={() => setImgError(true)}
                sizes="48px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[var(--bg-elevated)]">
                <span className="text-lg font-bold text-[var(--text-tertiary)]">
                  {person.fullName[0]}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-semibold text-sm text-[var(--text-primary)] truncate">
                {person.fullName}
              </span>
              {person.verificationStatus === 'VERIFIED' && (
                <CheckCircle size={13} className="shrink-0" style={{ color: '#22c55e' }} />
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary)] truncate">
              {person.professionalTitle}
            </p>
          </div>

          <ArrowRight
            size={16}
            className="shrink-0 text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)] transition-colors"
          />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn('group', className)}
    >
      <Link
        href={`/people/${person.slug}`}
        className="block rounded-2xl border border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-card)] transition-all duration-300 hover:border-[var(--border-default)] hover:shadow-[var(--mova-shadow-lg)] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
        style={{ display: 'block' }}
        aria-label={`View ${person.fullName}'s profile`}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-portrait bg-[var(--bg-elevated)]">
          {!imgError ? (
            <motion.div
              animate={{ scale: isHovered ? 1.04 : 1.0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full h-full"
            >
              <Image
                src={person.avatarUrl}
                alt={`${person.fullName} — ${person.professionalTitle}`}
                fill
                className="object-cover"
                onError={() => setImgError(true)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading={index < 3 ? 'eager' : 'lazy'}
              />
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span
                className="text-6xl font-black text-[var(--text-tertiary)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {person.fullName[0]}
              </span>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)]/60 via-transparent to-transparent" />

          {/* Verification badge */}
          {person.verificationStatus === 'VERIFIED' && (
            <div className="absolute top-3 right-3">
              <div className="badge badge-verified">
                <CheckCircle size={10} />
                Verified
              </div>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <div className="badge badge-neutral text-[10px]">
              {categoryLabel}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Name & Verification */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              className="text-h3 leading-tight"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
            >
              {person.fullName}
            </h3>
          </div>

          {/* Title */}
          <p className="text-sm text-[var(--accent-primary)] font-medium mb-2 leading-tight">
            {person.professionalTitle}
          </p>

          {/* Recognition */}
          {person.recognition && (
            <p className="text-xs text-[var(--text-secondary)] mb-3 line-clamp-1">
              {person.recognition}
            </p>
          )}

          {/* Short bio */}
          <p className="text-body-sm text-[var(--text-secondary)] line-clamp-2 mb-4">
            {truncate(person.shortBio, 100)}
          </p>

          {/* Footer row */}
          <div className="flex items-center justify-between">
            {/* Location */}
            {person.publicLocation && (
              <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                <MapPin size={11} />
                <span>{person.publicLocation}</span>
              </div>
            )}

            {/* Explore arrow */}
            <motion.div
              animate={{
                x: isHovered ? 4 : 0,
                color: isHovered ? 'var(--accent-primary)' : 'var(--text-tertiary)',
              }}
              transition={{ duration: 0.2 }}
              className="ml-auto"
            >
              <ArrowRight size={16} />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
