import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const footerLinks = {
  platform: [
    { label: 'Explore People', href: '/explore' },
    { label: 'Categories', href: '/categories' },
    { label: 'Claim a Profile', href: '/claim' },
  ],
  company: [
    { label: 'About MOVA', href: '/about' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
  auth: [
    { label: 'Sign In', href: '/login' },
    { label: 'Create Account', href: '/register' },
  ],
};

export function Footer() {
  return (
    <footer
      className="border-t border-[var(--border-subtle)]"
      style={{ background: 'var(--bg-elevated)' }}
      role="contentinfo"
    >
      <div className="container-mova py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center">
                <span
                  className="font-black text-sm"
                  style={{ color: '#0B0D12', fontFamily: 'var(--font-display)' }}
                >
                  M
                </span>
              </div>
              <span
                className="text-xl font-black tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                MOVA
              </span>
            </Link>
            <p className="text-body-sm text-[var(--text-secondary)] max-w-xs leading-relaxed mb-6">
              Discover the world&apos;s most interesting people. Explore their stories,
              careers, and achievements in one place.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/explore"
                className="btn btn-primary btn-sm"
              >
                Start Exploring
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-eyebrow mb-4">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-eyebrow mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-eyebrow mb-4">Account</h3>
            <ul className="space-y-3">
              {footerLinks.auth.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-caption text-[var(--text-tertiary)]">
            © 2026 MOVA. All rights reserved. Profile data is for illustrative purposes only.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-caption text-[var(--text-tertiary)]">
              Built with Next.js 16 & React 19
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
