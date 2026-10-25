import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/layout/Footer';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main
        style={{ paddingTop: 'var(--nav-height)' }}
        id="main-content"
        tabIndex={-1}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
