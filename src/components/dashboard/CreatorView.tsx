'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Star,
  Award,
  FolderOpen,
  Image as ImageIcon,
  Globe,
  CheckCircle2,
  ExternalLink,
  Edit,
  Plus,
  Trash2,
  Save,
  Eye,
  TrendingUp,
  Share2,
  Sparkles,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

interface CreatorViewProps {
  initialTab?: string;
}

export function CreatorView({ initialTab = 'overview' }: CreatorViewProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editable bio state
  const [professionalTitle, setProfessionalTitle] = useState('Jazz Pianist & Composer');
  const [location, setLocation] = useState('Tokyo, Japan / Paris, France');
  const [shortBio, setShortBio] = useState(
    'Contemporary jazz pianist blending traditional modal jazz with Japanese classical instrumentation and modern electronic textures.'
  );
  const [fullBio, setFullBio] = useState(
    'Aiko Nakamura is one of East Asia’s most acclaimed contemporary jazz pianists. Trained at the Tokyo University of the Arts and the Conservatoire de Paris, she has headlined major international jazz festivals including Montreux, Newport, and the Tokyo Jazz Festival.'
  );

  // Editable achievements
  const [achievements, setAchievements] = useState([
    { id: 'ach-1', title: 'Montreux Jazz Soloist Award', year: '2023', organization: 'Montreux Jazz Festival' },
    { id: 'ach-2', title: 'Tokyo New Wave Improviser of the Year', year: '2021', organization: 'Japan Jazz Federation' },
    { id: 'ach-3', title: 'Blue Note Tokyo 3-Day Sold-Out Residency', year: '2022', organization: 'Blue Note Records' },
  ]);

  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchYear, setNewAchYear] = useState('2024');

  // Editable social accounts
  const [spotifyUrl, setSpotifyUrl] = useState('https://spotify.com/artist/aiko-nakamura');
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com/aiko.jazz');
  const [youtubeUrl, setYoutubeUrl] = useState('https://youtube.com/@aikonakamura');

  // Load persisted creator data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedBio = localStorage.getItem('mova_creator_bio_data');
        if (storedBio) {
          const parsed = JSON.parse(storedBio);
          if (parsed.professionalTitle) setProfessionalTitle(parsed.professionalTitle);
          if (parsed.location) setLocation(parsed.location);
          if (parsed.shortBio) setShortBio(parsed.shortBio);
          if (parsed.fullBio) setFullBio(parsed.fullBio);
        }
        const storedAch = localStorage.getItem('mova_creator_achievements');
        if (storedAch) {
          setAchievements(JSON.parse(storedAch));
        }
      } catch {}
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'mova_creator_bio_data',
          JSON.stringify({ professionalTitle, location, shortBio, fullBio })
        );
      } catch {}
    }
    showToast('Profile biography and professional title updated successfully!');
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchTitle.trim()) return;
    const newEntry = {
      id: `ach-${Date.now()}`,
      title: newAchTitle.trim(),
      year: newAchYear,
      organization: 'Verified Organization',
    };
    const updated = [newEntry, ...achievements];
    setAchievements(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mova_creator_achievements', JSON.stringify(updated));
      } catch {}
    }
    setNewAchTitle('');
    showToast(`Achievement "${newEntry.title}" added to your profile!`);
  };

  const handleDeleteAchievement = (id: string, title: string) => {
    const updated = achievements.filter((a) => a.id !== id);
    setAchievements(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mova_creator_achievements', JSON.stringify(updated));
      } catch {}
    }
    showToast(`Achievement "${title}" removed.`);
  };

  return (
    <DashboardLayout requiredRole="CREATOR">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3"
            style={{
              background: '#0F172A',
              border: '1px solid #A78BFA',
              color: '#F8FAFC',
              boxShadow: '0 10px 25px rgba(167, 139, 250, 0.2)',
            }}
          >
            <CheckCircle2 size={18} style={{ color: '#A78BFA' }} />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A78BFA] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#A78BFA]">
                Official Creator Management Portal
              </span>
            </div>
            <h1
              className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Aiko Nakamura &bull; Studio & Profile
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/people/aiko-nakamura"
              target="_blank"
              className="btn btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              <ExternalLink size={14} /> View Live Profile
            </Link>
            <button
              onClick={() => showToast('Profile link copied to clipboard!')}
              className="btn btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)] mb-2">
              <span>Monthly Views</span>
              <Eye size={16} className="text-[#A78BFA]" />
            </div>
            <div className="text-2xl font-black text-[#A78BFA]" style={{ fontFamily: 'var(--font-display)' }}>
              12,480
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#34D399] mt-1 font-medium">
              <TrendingUp size={12} /> +28% this month
            </div>
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)] mb-2">
              <span>Search Impressions</span>
              <Sparkles size={16} className="text-[#60A5FA]" />
            </div>
            <div className="text-2xl font-black" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              4,120
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1">
              Top query: &quot;Tokyo jazz piano&quot;
            </div>
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)] mb-2">
              <span>Saved in Collections</span>
              <Star size={16} className="text-[#C7FF61]" />
            </div>
            <div className="text-2xl font-black text-[#C7FF61]" style={{ fontFamily: 'var(--font-display)' }}>
              890
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1">
              Followers on MOVA
            </div>
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)] mb-2">
              <span>Verification</span>
              <CheckCircle2 size={16} className="text-[#34D399]" />
            </div>
            <div className="text-2xl font-black text-[#34D399]" style={{ fontFamily: 'var(--font-display)' }}>
              VERIFIED
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-1">
              Official Artist Badge
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[var(--border-subtle)]">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'biography', label: 'Edit Biography & Title' },
            { id: 'achievements', label: `Achievements (${achievements.length})` },
            { id: 'social', label: 'Social & Media Links' },
            { id: 'claim', label: 'Verification Badge' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                activeTab === tab.id
                  ? 'bg-[#A78BFA] text-[#0B0D12] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: Overview / Profile Live Card */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
              className="p-6 rounded-2xl space-y-4 lg:col-span-2"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Profile Completion & Recommendations
                </h3>
                <span className="text-xs font-bold text-[#A78BFA]">92% Complete</span>
              </div>

              <div className="w-full h-2 rounded-full bg-[var(--surface-active)] overflow-hidden">
                <div className="h-full bg-[#A78BFA] rounded-full" style={{ width: '92%' }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-[#34D399] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      Identity Verified
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      Artist management documentation confirmed.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-[#34D399] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      High-Resolution Portraits
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      Gallery photos indexed for discovery.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="p-6 rounded-2xl space-y-4"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
            >
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                Public Profile Quick View
              </h3>

              <div className="text-center py-2">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center font-black text-lg"
                  style={{ background: '#A78BFA20', color: '#A78BFA', border: '2px solid #A78BFA' }}
                >
                  AN
                </div>
                <h4 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                  Aiko Nakamura
                </h4>
                <p className="text-xs text-[#A78BFA] font-medium">{professionalTitle}</p>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-1">{location}</p>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => setActiveTab('biography')}
                  className="w-full btn btn-primary text-xs py-2 flex items-center justify-center gap-1.5"
                >
                  <Edit size={13} /> Edit Profile Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: BIOGRAPHY */}
        {activeTab === 'biography' && (
          <form
            onSubmit={handleSaveBio}
            className="p-6 rounded-2xl space-y-5 max-w-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                Edit Biography & Professional Credentials
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Keep your headline, locations, and biography updated on MOVA.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Professional Title / Discipline
                </label>
                <input
                  type="text"
                  value={professionalTitle}
                  onChange={(e) => setProfessionalTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-[#A78BFA]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Primary Locations & Cities
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-[#A78BFA]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Short Bio (shown on search cards)
                </label>
                <textarea
                  rows={2}
                  value={shortBio}
                  onChange={(e) => setShortBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-[#A78BFA]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Full Biography
                </label>
                <textarea
                  rows={5}
                  value={fullBio}
                  onChange={(e) => setFullBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-[#A78BFA]"
                />
              </div>

              <button type="submit" className="btn btn-primary text-xs px-5 py-2.5 flex items-center gap-2">
                <Save size={14} /> Save Biography Changes
              </button>
            </div>
          </form>
        )}

        {/* TAB: ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <div
            className="p-6 rounded-2xl space-y-6 max-w-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                Achievements, Awards & Milestones
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Recognitions highlighted on your public profile timeline.
              </p>
            </div>

            {/* Add new achievement form */}
            <form
              onSubmit={handleAddAchievement}
              className="p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-3"
            >
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                Add New Achievement
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g. Grammy Nomination for Best Improvisation"
                  value={newAchTitle}
                  onChange={(e) => setNewAchTitle(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl text-xs bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-[#A78BFA]"
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={newAchYear}
                  onChange={(e) => setNewAchYear(e.target.value)}
                  className="w-20 px-3 py-2 rounded-xl text-xs bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-[#A78BFA]"
                />
                <button type="submit" className="btn btn-primary text-xs px-3.5 py-2 flex items-center gap-1">
                  <Plus size={14} /> Add
                </button>
              </div>
            </form>

            {/* Achievements list */}
            <div className="space-y-3">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: '#A78BFA15', color: '#A78BFA' }}
                    >
                      <Award size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        {ach.title}
                      </p>
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        {ach.organization} &bull; {ach.year}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAchievement(ach.id, ach.title)}
                    className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete achievement"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SOCIAL */}
        {activeTab === 'social' && (
          <div
            className="p-6 rounded-2xl space-y-4 max-w-xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                Verified Streaming & Social Accounts
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Connect external accounts so visitors can explore your work directly.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-[var(--text-secondary)]">Spotify Artist URL</label>
                <input
                  type="text"
                  value={spotifyUrl}
                  onChange={(e) => setSpotifyUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-[var(--text-secondary)]">Instagram Profile</label>
                <input
                  type="text"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-[var(--text-secondary)]">YouTube Channel</label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)]"
                />
              </div>

              <button
                onClick={() => showToast('Social accounts saved!')}
                className="btn btn-primary text-xs px-4 py-2 mt-2"
              >
                Save Social Links
              </button>
            </div>
          </div>
        )}

        {/* TAB: CLAIM */}
        {activeTab === 'claim' && (
          <div
            className="p-6 rounded-2xl space-y-4 max-w-xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Verified Identity Status: Active
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Badge granted on Sep 12, 2023 via Official Artist Management.
                </p>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Your profile is verified. Changes to your biography, accomplishments, and media are published directly without waiting in the moderation approval queue.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
