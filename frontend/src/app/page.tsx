'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import FeatureCard from '@/components/FeatureCard';
import WardrobeSection from '@/components/WardrobeSection';
import ShuffleSection from '@/components/ShuffleSection';
import AuthSection from '@/components/AuthSection';
import { TextRoll } from '@/components/v1/skiper58';

// Lazy-load Antigravity (uses WebGL/Three.js — must be client-only with no SSR)
const Antigravity = dynamic(
  () => import('@/components/animations/Antigravity'),
  { ssr: false }
);

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    title: 'Upload Items',
    description: 'Drag and drop your clothing images organized by category — tops, bottoms, and shoes.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <line x1="4" y1="4" x2="9" y2="9" />
      </svg>
    ),
    title: 'Shuffle Outfits',
    description: 'Generate random outfit combinations from your wardrobe. Every shuffle creates a unique look.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    title: 'Visual Preview',
    description: 'See your outfit combinations displayed beautifully with full image previews side by side.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: 'Personal Accounts',
    description: 'Secure sign-up and login to keep your wardrobe private and accessible from anywhere.',
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Navbar />

      {/* ─── Hero Section ─── */}
      <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Antigravity background */}
        <div className="absolute inset-0 z-0">
          <Antigravity
            className="h-full w-full"
            color="#d0cfd7"
            count={400}
            particleSize={1.8}
            magnetRadius={12}
            ringRadius={8}
            waveSpeed={0.3}
            waveAmplitude={0.8}
            lerpSpeed={0.08}
            autoAnimate={true}
            particleShape="capsule"
            depthFactor={0.8}
            pulseSpeed={2}
            rotationSpeed={0.1}
            fieldStrength={8}
          />
        </div>

        {/* Gradient overlays */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-background/60 via-transparent to-background/60" />

        {/* Content */}
        <div className="relative z-20 mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-accent-dim">
              Outfit Organizer & Wardrobe Shuffler
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="shimmer-text text-6xl font-bold tracking-tight md:text-8xl lg:text-9xl"
          >
            OUAI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-6 max-w-xl text-lg text-accent-dim md:text-xl"
          >
            Digitize your wardrobe. Shuffle your style. Discover outfits you never knew you had.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                document.getElementById('wardrobe')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="rounded-2xl bg-accent/15 px-8 py-3.5 text-sm font-semibold text-accent ring-1 ring-accent/30 transition-all hover:bg-accent/25 hover:ring-accent/50"
            >
              <TextRoll className="text-sm font-semibold">Open Wardrobe</TextRoll>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="rounded-2xl px-8 py-3.5 text-sm font-medium text-accent-dim ring-1 ring-border transition-all hover:text-foreground hover:ring-accent/30"
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" className="relative py-32">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent-dim">
              How It Works
            </p>
            <h2 className="gradient-text text-4xl font-bold tracking-tight md:text-5xl">
              Everything You Need
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feat, i) => (
              <FeatureCard
                key={feat.title}
                icon={feat.icon}
                title={feat.title}
                description={feat.description}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Wardrobe Section ─── */}
      <WardrobeSection />

      {/* ─── Divider ─── */}
      <div className="mx-auto h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* ─── Shuffle Section ─── */}
      <ShuffleSection />

      {/* ─── Divider ─── */}
      <div className="mx-auto h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* ─── Auth Section ─── */}
      <AuthSection />

      {/* ─── Footer ─── */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20">
                <span className="text-xs font-bold">O</span>
              </div>
              <span className="text-sm font-medium text-accent-dim">OUAI</span>
            </div>
            <p className="text-xs text-accent-dim/60">
              © {new Date().getFullYear()} OUAI. Outfit Organizer & Wardrobe Shuffler.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
