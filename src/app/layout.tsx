import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Syne } from 'next/font/google';
import { MotionProvider } from '@/components/MotionProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'MOVA — Discover People. Explore Their Stories.',
    template: '%s | MOVA',
  },
  description:
    'MOVA is a premium People Discovery platform. Explore the lives, careers, and achievements of artists, athletes, entrepreneurs, scientists, and creators from around the world.',
  keywords: ['people discovery', 'profiles', 'achievements', 'careers', 'MOVA'],
  authors: [{ name: 'MOVA Team' }],
  creator: 'MOVA',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mova.app',
    siteName: 'MOVA',
    title: 'MOVA — Discover People. Explore Their Stories.',
    description:
      "Discover the world's most interesting people — their stories, achievements, and careers — all in one place.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MOVA — People Discovery Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MOVA — Discover People. Explore Their Stories.',
    description: 'Premium People Discovery platform.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  metadataBase: new URL('https://mova.app'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0B0D12' },
    { media: '(prefers-color-scheme: light)', color: '#F7F7F4' },
  ],
};

// Inline theme script to prevent flash of wrong theme
function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var stored = localStorage.getItem('mova-theme');
              var theme = stored === 'light' ? 'light' : 'dark';
              document.documentElement.setAttribute('data-theme', theme);
            } catch(e) {
              document.documentElement.setAttribute('data-theme', 'dark');
            }
          })();
        `,
      }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <ThemeScript />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
