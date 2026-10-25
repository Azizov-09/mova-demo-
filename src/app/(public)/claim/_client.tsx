'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Search,
  ArrowRight,
  ArrowLeft,
  FileText,
  User,
  Mail,
  Briefcase,
  Link2,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { mockPeople } from '@/data/mock/people';
import { claimsRepository } from '@/data/repositories/mock';

export default function ClaimProfileClient() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form state
  const [selectedSlug, setSelectedSlug] = useState('');
  const [searchPerson, setSearchPerson] = useState('');
  const [claimantName, setClaimantName] = useState('');
  const [claimantEmail, setClaimantEmail] = useState('');
  const [claimantProfession, setClaimantProfession] = useState('');
  const [evidence, setEvidence] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ referenceId: string; message: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const filteredPeople = mockPeople.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchPerson.toLowerCase()) ||
      p.professionalTitle.toLowerCase().includes(searchPerson.toLowerCase())
  );

  const selectedPerson = mockPeople.find((p) => p.slug === selectedSlug);

  const handleNextStep1 = () => {
    if (!selectedSlug) {
      setErrorMsg('Please select a profile to claim.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimantName.trim() || !claimantEmail.trim() || !claimantProfession.trim()) {
      setErrorMsg('Please fill in all identity fields.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidence.trim()) {
      setErrorMsg('Please provide evidence or an official link.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await claimsRepository.submit({
        profileSlug: selectedSlug,
        claimantName,
        claimantEmail,
        claimantProfession,
        evidence,
      });

      if (res.success && res.referenceId) {
        setResult({
          referenceId: res.referenceId,
          message: res.message,
        });
        setStep(4);
      }
    } catch {
      setErrorMsg('Failed to submit claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTicket = () => {
    if (!result?.referenceId) return;
    navigator.clipboard.writeText(result.referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 flex flex-col justify-center"
      style={{ background: 'var(--bg-base)', fontFamily: 'var(--font-sans)' }}
    >
      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{
              background: 'rgba(199, 255, 97, 0.1)',
              border: '1px solid rgba(199, 255, 97, 0.25)',
              color: 'var(--accent-primary)',
            }}
          >
            <ShieldCheck size={14} /> Official Profile Verification
          </div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Claim Your MOVA Profile
          </h1>
          <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Take ownership of your verified presence. Manage your biography, career milestones, media galleries, and privacy controls.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="flex items-center justify-between max-w-md mx-auto mb-8 px-4">
          {[
            { num: 1, label: 'Select Profile' },
            { num: 2, label: 'Your Identity' },
            { num: 3, label: 'Evidence' },
            { num: 4, label: 'Confirmed' },
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  step === s.num
                    ? 'bg-[#C7FF61] text-[#0B0D12]'
                    : step > s.num
                    ? 'bg-[#C7FF61]/20 text-[#C7FF61]'
                    : 'bg-[var(--surface-active)] text-[var(--text-tertiary)]'
                }`}
              >
                {step > s.num ? <Check size={14} /> : s.num}
              </div>
              {idx < 3 && (
                <div
                  className={`w-8 sm:w-14 h-0.5 transition-colors ${
                    step > s.num ? 'bg-[#C7FF61]' : 'bg-[var(--border-subtle)]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Select Profile */}
        {step === 1 && (
          <div
            className="p-6 sm:p-8 rounded-3xl space-y-6"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
            }}
          >
            <div>
              <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Step 1: Choose the Profile to Claim
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Find your existing page in the MOVA directory or choose your name.
              </p>
            </div>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
              />
              <input
                type="text"
                placeholder="Search by name or profession..."
                value={searchPerson}
                onChange={(e) => setSearchPerson(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-[#C7FF61]"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {filteredPeople.map((person) => {
                const isSelected = selectedSlug === person.slug;
                return (
                  <div
                    key={person.id}
                    onClick={() => setSelectedSlug(person.slug)}
                    className={`p-3.5 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? 'bg-[#C7FF61]/10 border-[#C7FF61]'
                        : 'bg-[var(--bg-base)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                    }`}
                    style={{ border: `1px solid ${isSelected ? '#C7FF61' : 'var(--border-subtle)'}` }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs"
                        style={{ background: 'var(--surface-active)', color: 'var(--text-primary)' }}
                      >
                        {person.fullName.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                            {person.fullName}
                          </p>
                          {person.verificationStatus === 'VERIFIED' && (
                            <CheckCircle2 size={13} className="text-[#C7FF61]" />
                          )}
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)]">
                          {person.professionalTitle}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-[#C7FF61] bg-[#C7FF61] text-[#0B0D12]'
                          : 'border-[var(--border-default)]'
                      }`}
                    >
                      {isSelected && <Check size={12} />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={handleNextStep1}
                className="btn btn-primary text-xs px-5 py-2.5 flex items-center gap-2"
              >
                Continue to Identity <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Identity */}
        {step === 2 && (
          <form
            onSubmit={handleNextStep2}
            className="p-6 sm:p-8 rounded-3xl space-y-6"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
            }}
          >
            <div>
              <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Step 2: Confirm Your Identity
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Target Profile: <strong className="text-[#C7FF61]">{selectedPerson?.fullName}</strong> ({selectedPerson?.professionalTitle})
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Your Full Legal Name
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aiko Nakamura"
                    value={claimantName}
                    onChange={(e) => setClaimantName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-[#C7FF61]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Official Email Address (Institution or Domain)
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. contact@aiko-nakamura.jp"
                    value={claimantEmail}
                    onChange={(e) => setClaimantEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-[#C7FF61]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Professional Role / Relation to Profile
                </label>
                <div className="relative">
                  <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Self (Artist), Official Agency Representative"
                    value={claimantProfession}
                    onChange={(e) => setClaimantProfession(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-[#C7FF61]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-secondary text-xs px-4 py-2 flex items-center gap-1.5"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                type="submit"
                className="btn btn-primary text-xs px-5 py-2.5 flex items-center gap-2"
              >
                Provide Verification Evidence <ArrowRight size={14} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Evidence */}
        {step === 3 && (
          <form
            onSubmit={handleSubmitClaim}
            className="p-6 sm:p-8 rounded-3xl space-y-6"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
            }}
          >
            <div>
              <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Step 3: Verification Evidence
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Provide official links (website, Wikipedia, verified social handle, or management contract URL).
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Public Evidence URL / Proof Documentation
                </label>
                <div className="relative">
                  <Link2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                  <input
                    type="text"
                    required
                    placeholder="https://example.com/press-kit or https://instagram.com/official"
                    value={evidence}
                    onChange={(e) => setEvidence(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-[#C7FF61]"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] space-y-2">
                <p className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#C7FF61]" /> Verification Guidelines
                </p>
                <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
                  <li>Accepted proofs: Official artist website, verified social account, press release, institutional directory entry.</li>
                  <li>In this demo environment, claims are reviewed instantly by Super Admin and Admin roles in their dashboards.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn btn-secondary text-xs px-4 py-2 flex items-center gap-1.5"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary text-xs px-6 py-2.5 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>Submit Verification Claim</>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Confirmation */}
        {step === 4 && result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-10 rounded-3xl text-center space-y-6"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid rgba(199, 255, 97, 0.3)',
            }}
          >
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-[#C7FF61]/15 text-[#C7FF61] border border-[#C7FF61]/30">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <h2
                className="text-2xl font-black mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                Claim Request Received!
              </h2>
              <p className="text-xs max-w-md mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {result.message}
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-tertiary)]">
                  Reference Ticket ID
                </span>
                <p className="font-mono text-sm font-bold text-[#C7FF61]">
                  {result.referenceId}
                </p>
              </div>
              <button
                onClick={copyTicket}
                className="btn btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
              >
                {copied ? <Check size={13} className="text-[#C7FF61]" /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[var(--border-subtle)]">
              <Link href="/explore" className="btn btn-secondary text-xs px-5 py-2.5">
                Back to Explore
              </Link>
              <Link href="/login" className="btn btn-primary text-xs px-5 py-2.5">
                Log In to Admin Dashboard to Review
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
