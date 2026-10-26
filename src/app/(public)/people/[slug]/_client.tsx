'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  MapPin,
  Sparkles,
  Share2,
  Bookmark,
  ExternalLink,
  Award,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import type { Person } from '@/types';
import { mockPeople } from '@/data/mock/people';

interface PersonDetailClientProps {
  person: Person;
}

export default function PersonDetailClient({ person }: PersonDetailClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'achievements' | 'projects' | 'gallery'>('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    showToast(!isSaved ? `${person.fullName} saved to your collection!` : `${person.fullName} removed from saved.`);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Profile link copied to clipboard!');
    }
  };

  const relatedPeople = mockPeople
    .filter((p) => p.id !== person.id && p.categories.some((c) => person.categories.includes(c)))
    .slice(0, 3);

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg-base)', fontFamily: 'var(--font-body)' }}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3"
            style={{
              background: '#0F172A',
              border: '1px solid #C7FF61',
              color: '#F8FAFC',
              boxShadow: '0 10px 25px rgba(199, 255, 97, 0.2)',
            }}
          >
            <CheckCircle2 size={18} style={{ color: '#C7FF61' }} />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cover Header */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-[var(--surface-active)]">
        {person.coverImageUrl ? (
          <Image
            src={person.coverImageUrl}
            alt={`${person.fullName} cover`}
            fill
            className="object-cover opacity-60"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-zinc-900 to-zinc-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-transparent to-black/40" />

        <div className="absolute top-24 left-4 sm:left-8 z-10">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Explore
          </Link>
        </div>
      </div>

      {/* Profile Bio Header Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-28 relative z-20">
        <div
          className="p-6 sm:p-8 rounded-3xl"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              {/* Avatar */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 border-4 border-[var(--bg-elevated)] shadow-xl bg-[var(--surface-active)]">
                {person.avatarUrl ? (
                  <Image
                    src={person.avatarUrl}
                    alt={person.fullName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 112px, 128px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-3xl text-[var(--accent-primary)]">
                    {person.fullName.slice(0, 2)}
                  </div>
                )}
              </div>

              {/* Names & Titles */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1
                    className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                  >
                    {person.fullName}
                  </h1>
                  {person.verificationStatus === 'VERIFIED' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C7FF61]/15 text-[#C7FF61] border border-[#C7FF61]/30">
                      <CheckCircle2 size={13} /> Verified
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-[#A78BFA]">
                  {person.professionalTitle}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-[var(--text-secondary)] pt-1 flex-wrap">
                  {person.publicLocation && (
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-[var(--text-tertiary)]" />
                      {person.publicLocation}
                    </span>
                  )}
                  {person.recognition && (
                    <span className="flex items-center gap-1 text-[#F59E0B] font-medium">
                      <Award size={13} />
                      {person.recognition}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions: Save, Share, Claim */}
            <div className="flex items-center justify-center gap-2.5 shrink-0 pt-2 md:pt-0">
              <button
                onClick={handleToggleSave}
                className={`btn text-xs px-4 py-2.5 flex items-center gap-1.5 ${
                  isSaved ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                <Bookmark size={15} />
                {isSaved ? 'Saved' : 'Save'}
              </button>

              <button
                onClick={handleShare}
                className="btn btn-secondary text-xs px-3.5 py-2.5 flex items-center gap-1.5"
                title="Share profile"
              >
                <Share2 size={15} /> Share
              </button>

              <Link
                href={`/claim?slug=${person.slug}`}
                className="btn btn-ghost text-xs px-3 py-2.5 flex items-center gap-1.5 text-[var(--text-tertiary)] hover:text-[#C7FF61]"
                title="Claim this profile"
              >
                <ShieldCheck size={15} /> Claim
              </Link>
            </div>
          </div>

          {/* Social Links Row */}
          {person.socialAccounts && person.socialAccounts.length > 0 && (
            <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] flex items-center gap-3 flex-wrap">
              <span className="text-xs font-semibold text-[var(--text-tertiary)]">External:</span>
              {person.socialAccounts.map((acc, idx) => (
                <a
                  key={idx}
                  href={acc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg text-xs bg-[var(--bg-base)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center gap-1.5"
                >
                  <ExternalLink size={12} />
                  <span className="capitalize">{acc.platform}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-6 border-b border-[var(--border-subtle)]">
          {[
            { id: 'overview', label: 'Overview & Bio' },
            { id: 'timeline', label: `Career Timeline (${person.timeline?.length || 0})` },
            { id: 'achievements', label: `Achievements (${person.achievements?.length || 0})` },
            { id: 'projects', label: `Projects (${person.projects?.length || 0})` },
            { id: 'gallery', label: `Media Gallery (${person.gallery?.length || 0})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                activeTab === tab.id
                  ? 'bg-[#C7FF61] text-[#0B0D12] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div
                className="lg:col-span-2 p-6 sm:p-8 rounded-3xl space-y-5"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
              >
                <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                  Biography & Background
                </h3>
                <p className="text-sm leading-relaxed whitespace-pre-line text-[var(--text-secondary)]">
                  {person.biography}
                </p>

                {person.currentActivity && (
                  <div className="p-4 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-1 mt-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-[#C7FF61]" />
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        Current Activity: {person.currentActivity.label}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {person.currentActivity.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar Quick Facts */}
              <div
                className="p-6 rounded-3xl space-y-4 h-fit"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
              >
                <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                  Profile Details
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
                    <span className="text-[var(--text-secondary)]">Primary Discipline</span>
                    <span className="font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
                      {person.categories.join(', ').replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
                    <span className="text-[var(--text-secondary)]">Location</span>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {person.publicLocation || 'Global'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
                    <span className="text-[var(--text-secondary)]">Verification</span>
                    <span className="font-semibold text-[#C7FF61]">
                      {person.verificationStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TIMELINE */}
          {activeTab === 'timeline' && (
            <div
              className="p-6 sm:p-8 rounded-3xl space-y-6 max-w-3xl"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
            >
              <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                Career Milestones & Chronology
              </h3>

              <div className="relative pl-6 sm:pl-8 border-l-2 border-[var(--border-subtle)] space-y-8">
                {person.timeline?.map((item) => (
                  <div key={item.id} className="relative group">
                    {/* Glowing indicator dot */}
                    <div
                      className={`absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full border-2 border-[var(--bg-elevated)] ${
                        item.current ? 'bg-[#C7FF61] ring-4 ring-[#C7FF61]/20' : 'bg-[var(--surface-active)]'
                      }`}
                    />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#C7FF61]">{item.year}</span>
                        <span className="text-xs font-bold text-[var(--text-primary)]">&bull; {item.title}</span>
                        {item.organization && (
                          <span className="text-[11px] text-[var(--text-tertiary)]">({item.organization})</span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <div
              className="p-6 sm:p-8 rounded-3xl space-y-6"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
            >
              <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                Key Achievements & Honors
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {person.achievements?.map((ach) => (
                  <div
                    key={ach.id}
                    className="p-5 rounded-2xl space-y-2 flex flex-col justify-between"
                    style={{
                      background: 'var(--bg-base)',
                      border: ach.highlighted ? '1px solid #C7FF61' : '1px solid var(--border-subtle)',
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Award size={18} className={ach.highlighted ? 'text-[#C7FF61]' : 'text-[#60A5FA]'} />
                          <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                            {ach.title}
                          </h4>
                        </div>
                        {ach.highlighted && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C7FF61]/15 text-[#C7FF61]">
                            Highlighted
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {ach.description}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-tertiary)]">
                      {ach.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PROJECTS */}
          {activeTab === 'projects' && (
            <div
              className="p-6 sm:p-8 rounded-3xl space-y-6"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
            >
              <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                Featured Projects & Productions
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {person.projects?.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-5 rounded-2xl space-y-3 flex flex-col justify-between"
                    style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                          {proj.title}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            proj.status === 'completed'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-blue-500/15 text-blue-400'
                          }`}
                        >
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                        {proj.description}
                      </p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {proj.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full text-[10px] bg-[var(--surface-active)] text-[var(--text-secondary)]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {proj.url && (
                      <div className="pt-3 border-t border-[var(--border-subtle)]">
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-[#60A5FA] hover:underline inline-flex items-center gap-1"
                        >
                          Visit Project Site <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: GALLERY */}
          {activeTab === 'gallery' && (
            <div
              className="p-6 sm:p-8 rounded-3xl space-y-6"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
            >
              <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                Media & Photography Gallery
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {person.gallery?.map((img) => (
                  <div
                    key={img.id}
                    className="group rounded-2xl overflow-hidden bg-[var(--surface-active)] border border-[var(--border-subtle)]"
                  >
                    <div className="relative h-64 w-full">
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                    {img.caption && (
                      <div className="p-3 bg-[var(--bg-base)] text-xs text-[var(--text-secondary)]">
                        {img.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Profiles Section */}
        {relatedPeople.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] space-y-4">
            <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              Related Profiles in {person.categories[0]?.replace('-', ' ')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPeople.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/people/${rel.slug}`}
                  className="p-4 rounded-2xl flex items-center gap-3.5 group transition-all duration-200"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0 bg-[var(--surface-active)]">
                    {rel.avatarUrl ? (
                      <Image
                        src={rel.avatarUrl}
                        alt={rel.fullName}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-sm text-[var(--accent-primary)]">
                        {rel.fullName.slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate group-hover:text-[#C7FF61] transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {rel.fullName}
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary)] truncate">
                      {rel.professionalTitle}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
