'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

interface WardrobeItem {
  ITEM_ID: number;
  USER_ID: number;
  CATEGORY: string;
  IMAGE_PATH: string;
}

interface User {
  id: number;
  username: string;
}

interface Outfit {
  top: WardrobeItem | null;
  bottom: WardrobeItem | null;
  shoes: WardrobeItem | null;
}

export default function ShuffleSection() {
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchItems = useCallback(async (userId: number) => {
    try {
      const res = await fetch(`/api/wardrobe?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load items for shuffle:', err);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('ouai_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setCurrentUser(u);
        fetchItems(u.id);
      } catch {}
    }

    const handleAuthChange = () => {
      const uStr = localStorage.getItem('ouai_user');
      const u = uStr ? JSON.parse(uStr) : null;
      setCurrentUser(u);
      if (u) {
        fetchItems(u.id);
      } else {
        setItems([]);
        setOutfit(null);
      }
    };

    window.addEventListener('ouai-auth-change', handleAuthChange);
    return () => window.removeEventListener('ouai-auth-change', handleAuthChange);
  }, [fetchItems]);

  const shuffle = useCallback(() => {
    if (!currentUser) {
      setErrorMsg('Please sign in below to shuffle your wardrobe.');
      return;
    }

    setIsShuffling(true);
    setOutfit(null);
    setErrorMsg(null);

    setTimeout(() => {
      const tops = items.filter((i) => i.CATEGORY === 'tops');
      const bottoms = items.filter((i) => i.CATEGORY === 'bottoms');
      const shoes = items.filter((i) => i.CATEGORY === 'shoes');

      if (tops.length === 0 && bottoms.length === 0 && shoes.length === 0) {
        setErrorMsg('Your wardrobe is empty! Upload some items in the section above first.');
        setIsShuffling(false);
        return;
      }

      const top = tops.length > 0 ? tops[Math.floor(Math.random() * tops.length)] : null;
      const bottom = bottoms.length > 0 ? bottoms[Math.floor(Math.random() * bottoms.length)] : null;
      const shoe = shoes.length > 0 ? shoes[Math.floor(Math.random() * shoes.length)] : null;

      setOutfit({ top, bottom, shoes: shoe });
      setIsShuffling(false);
    }, 700);
  }, [currentUser, items]);

  return (
    <section id="shuffle" className="relative py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent-dim">
            AI-Powered Styling
          </p>
          <h2 className="gradient-text text-4xl font-bold tracking-tight md:text-5xl">
            Shuffle Your Style
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-accent-dim">
            Generate random outfit combinations directly from your database wardrobe. Every shuffle creates a fresh look.
          </p>
        </motion.div>

        {/* Shuffle button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <motion.button
            onClick={shuffle}
            disabled={isShuffling}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-accent/20 to-accent/10 px-10 py-4 text-lg font-semibold text-accent ring-1 ring-accent/30 transition-all hover:ring-accent/50 disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="relative z-10 flex items-center gap-3">
              <motion.svg
                animate={isShuffling ? { rotate: 360 } : { rotate: 0 }}
                transition={isShuffling ? { duration: 0.6, repeat: Infinity, ease: 'linear' } : {}}
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
              </motion.svg>
              {isShuffling ? 'Shuffling...' : 'Shuffle Outfit'}
            </span>
          </motion.button>
        </motion.div>

        {errorMsg && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-sm text-amber-400"
          >
            {errorMsg}
          </motion.p>
        )}

        {/* Result cards */}
        <AnimatePresence mode="wait">
          {outfit && (
            <motion.div
              key={`${outfit.top?.ITEM_ID}-${outfit.bottom?.ITEM_ID}-${outfit.shoes?.ITEM_ID}`}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-3"
            >
              {[
                { label: 'Top', item: outfit.top, emoji: '👕' },
                { label: 'Bottom', item: outfit.bottom, emoji: '👖' },
                { label: 'Shoes', item: outfit.shoes, emoji: '👟' },
              ].map((slot, i) => (
                <motion.div
                  key={slot.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="glass-card glow-border flex flex-col items-center overflow-hidden p-5"
                >
                  <p className="mb-3 text-xs font-medium uppercase tracking-widest text-accent-dim">
                    {slot.label}
                  </p>
                  {slot.item ? (
                    <div className="aspect-square w-full overflow-hidden rounded-xl bg-surface-elevated ring-1 ring-border">
                      <img
                        src={`/api/image?path=${encodeURIComponent(slot.item.IMAGE_PATH)}`}
                        alt={slot.label}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-square w-full flex-col items-center justify-center rounded-xl bg-surface-elevated/50 text-accent-dim ring-1 ring-border">
                      <span className="text-3xl mb-1">{slot.emoji}</span>
                      <span className="text-xs">No {slot.label.toLowerCase()} found</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
