'use client';

import { useRouter } from 'next/navigation';
import { Skiper58 } from '@/components/v1/skiper58';

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'Features', href: '#features' },
  { label: 'Wardrobe', href: '#wardrobe' },
  { label: 'Shuffle', href: '#shuffle' },
];

export default function Navbar() {
  const router = useRouter();

  const handleNavClick = (item: { label: string; href: string }) => {
    if (item.href.startsWith('#')) {
      const el = document.getElementById(item.href.slice(1));
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(item.href);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="glass-card glow-border flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 ring-1 ring-accent/20">
              <span className="text-base font-bold text-accent">O</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              OUAI
            </span>
          </div>

          {/* Navigation - TextRoll from skiper-ui */}
          <div className="hidden md:block">
            <Skiper58
              items={navItems}
              itemClassName="text-sm font-medium tracking-wide"
              onItemClick={handleNavClick}
            />
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('auth');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-xl bg-accent/10 px-5 py-2 text-sm font-medium text-accent ring-1 ring-accent/20 transition-all hover:bg-accent/20 hover:ring-accent/40 active:scale-[0.97]"
            >
              Get Started
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
