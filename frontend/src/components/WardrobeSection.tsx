'use client';

import { motion } from 'framer-motion';
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

const categories = [
  {
    id: 'tops',
    label: 'Tops',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L2 8l4 2V22h12V10l4-2-4-6" />
        <path d="M9 2c0 2 1.5 4 3 4s3-2 3-4" />
      </svg>
    ),
    description: 'T-shirts, shirts, blouses, sweaters, jackets',
  },
  {
    id: 'bottoms',
    label: 'Bottoms',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2h12v6l-2 14H8L6 8V2z" />
        <path d="M12 2v20" />
        <path d="M6 8h12" />
      </svg>
    ),
    description: 'Jeans, trousers, skirts, shorts',
  },
  {
    id: 'shoes',
    label: 'Shoes',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 18h20v2H2z" />
        <path d="M4 18c0-4 2-8 6-10l4 2c4 0 6 3 6 8" />
        <path d="M8 12l2 1" />
      </svg>
    ),
    description: 'Sneakers, boots, heels, loafers',
  },
];

export default function WardrobeSection() {
  const [activeCategory, setActiveCategory] = useState('tops');
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchItems = useCallback(async (userId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/wardrobe?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load items:', err);
    } finally {
      setLoading(false);
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
      }
    };

    window.addEventListener('ouai-auth-change', handleAuthChange);
    return () => window.removeEventListener('ouai-auth-change', handleAuthChange);
  }, [fetchItems]);

  const handleFiles = async (files: File[]) => {
    if (!currentUser || files.length === 0) return;
    setUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('/api/image', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();

        if (uploadData.success && uploadData.imagePath) {
          await fetch('/api/wardrobe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: currentUser.id,
              category: activeCategory,
              imagePath: uploadData.imagePath,
            }),
          });
        }
      }
      await fetchItems(currentUser.id);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleDelete = async (itemId: number) => {
    if (!currentUser) return;
    try {
      await fetch(`/api/wardrobe?id=${itemId}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((i) => i.ITEM_ID !== itemId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const categoryItems = items.filter((i) => i.CATEGORY === activeCategory);

  return (
    <section id="wardrobe" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent-dim">
            Your Digital Closet
          </p>
          <h2 className="gradient-text text-4xl font-bold tracking-tight md:text-5xl">
            Build Your Wardrobe
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-accent-dim">
            Upload images of your clothing items organized by category. Our database will sync your collection across all devices.
          </p>
        </motion.div>

        {!currentUser ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card glow-border mx-auto max-w-lg p-10 text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground">Sign In Required</h3>
            <p className="mt-2 text-sm text-accent-dim">
              Please sign in or create an account below to view and manage your personal database wardrobe.
            </p>
            <button
              onClick={() => document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-6 rounded-xl bg-accent/15 px-6 py-3 text-sm font-semibold text-accent ring-1 ring-accent/30 transition-all hover:bg-accent/25"
            >
              Go to Sign In
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Category Tabs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-row gap-3 lg:flex-col"
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`glass-card group flex items-center gap-4 p-4 text-left transition-all duration-300 ${
                    activeCategory === cat.id
                      ? 'glow-border ring-1 ring-accent/30'
                      : 'hover:ring-1 hover:ring-border'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      activeCategory === cat.id
                        ? 'bg-accent/15 text-accent'
                        : 'bg-surface-elevated text-accent-dim'
                    }`}
                  >
                    {cat.icon}
                  </div>
                  <div className="hidden lg:block">
                    <p className="font-medium text-foreground">{cat.label}</p>
                    <p className="text-xs text-accent-dim">{cat.description}</p>
                  </div>
                </button>
              ))}
            </motion.div>

            {/* Upload Area & Gallery */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card glow-border overflow-hidden p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold capitalize">
                  {categories.find((c) => c.id === activeCategory)?.label} Collection
                </h3>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  {categoryItems.length} items
                </span>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`relative flex min-h-[180px] flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 ${
                  dragOver
                    ? 'border-accent/50 bg-accent/5'
                    : 'border-border bg-surface/50 hover:border-accent/30'
                }`}
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-elevated text-accent-dim">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="mb-1 text-sm font-medium text-foreground">
                  {uploading ? 'Uploading and saving to database...' : 'Drag & drop images here'}
                </p>
                <p className="mb-4 text-xs text-accent-dim">or click to browse from your computer</p>
                <label className={`cursor-pointer rounded-xl bg-accent/10 px-5 py-2 text-sm font-medium text-accent ring-1 ring-accent/20 transition-all hover:bg-accent/20 ${uploading ? 'pointer-events-none opacity-50' : ''}`}>
                  Browse Files
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploading}
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </label>
              </div>

              {/* Uploaded items gallery */}
              {loading ? (
                <div className="mt-8 text-center text-sm text-accent-dim">Loading wardrobe items...</div>
              ) : categoryItems.length > 0 ? (
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {categoryItems.map((item, i) => (
                    <motion.div
                      key={item.ITEM_ID}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="group relative aspect-square overflow-hidden rounded-xl bg-surface-elevated ring-1 ring-border"
                    >
                      <img
                        src={`/api/image?path=${encodeURIComponent(item.IMAGE_PATH)}`}
                        alt={item.CATEGORY}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 p-2">
                        <button
                          onClick={() => handleDelete(item.ITEM_ID)}
                          title="Delete item"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/80 text-white backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="mt-8 text-center text-sm text-accent-dim">
                  No items in this category yet. Upload your first {activeCategory.slice(0, -1)} above!
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
