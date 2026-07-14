'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

type Mode = 'login' | 'signup';

interface User {
  id: number;
  username: string;
}

export default function AuthSection() {
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('ouai_user');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {}
    }

    const handleAuthChange = () => {
      const u = localStorage.getItem('ouai_user');
      setCurrentUser(u ? JSON.parse(u) : null);
    };

    window.addEventListener('ouai-auth-change', handleAuthChange);
    return () => window.removeEventListener('ouai-auth-change', handleAuthChange);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setStatus({ type: 'error', message: 'Please enter both username and password.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: mode, username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus({ type: 'error', message: data.error || 'Authentication failed.' });
      } else {
        setStatus({
          type: 'success',
          message: mode === 'login' ? `Welcome back, ${data.user.username}!` : 'Account created successfully!',
        });
        localStorage.setItem('ouai_user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('ouai-auth-change'));
        setUsername('');
        setPassword('');
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Network error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('ouai_user');
    window.dispatchEvent(new Event('ouai-auth-change'));
    setStatus({ type: 'success', message: 'You have signed out successfully.' });
  };

  return (
    <section id="auth" className="relative py-32">
      <div className="mx-auto max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card glow-border overflow-hidden p-8"
        >
          {currentUser ? (
            <div className="text-center py-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 text-2xl font-bold text-accent ring-1 ring-accent/30">
                {currentUser.username[0].toUpperCase()}
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Logged in as <span className="gradient-text">{currentUser.username}</span>
              </h3>
              <p className="mt-2 text-sm text-accent-dim">
                Your wardrobe is synced with the database.
              </p>

              {status && (
                <p className="mt-4 text-sm text-emerald-400">
                  {status.message}
                </p>
              )}

              <button
                onClick={handleSignOut}
                className="mt-6 w-full rounded-xl bg-red-500/10 py-3 text-sm font-semibold text-red-400 ring-1 ring-red-500/20 transition-all hover:bg-red-500/20"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              {/* Toggle */}
              <div className="mb-8 flex rounded-xl bg-surface p-1 ring-1 ring-border">
                {(['login', 'signup'] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMode(m);
                      setStatus(null);
                    }}
                    className={`relative flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                      mode === m
                        ? 'bg-accent/15 text-accent shadow-sm'
                        : 'text-accent-dim hover:text-foreground'
                    }`}
                  >
                    {m === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="auth-username" className="mb-2 block text-xs font-medium uppercase tracking-widest text-accent-dim">
                    Username
                  </label>
                  <input
                    id="auth-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-accent-dim/50 outline-none transition-all focus:border-accent/40 focus:ring-1 focus:ring-accent/20"
                  />
                </div>
                <div>
                  <label htmlFor="auth-password" className="mb-2 block text-xs font-medium uppercase tracking-widest text-accent-dim">
                    Password
                  </label>
                  <input
                    id="auth-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-accent-dim/50 outline-none transition-all focus:border-accent/40 focus:ring-1 focus:ring-accent/20"
                  />
                </div>

                {status && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-sm ${
                      status.type === 'error' ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {status.message}
                  </motion.p>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-xl bg-accent/15 py-3 text-sm font-semibold text-accent ring-1 ring-accent/30 transition-all hover:bg-accent/25 hover:ring-accent/50 disabled:opacity-50"
                >
                  {loading
                    ? 'Processing...'
                    : mode === 'login'
                    ? 'Sign In'
                    : 'Create Account'}
                </motion.button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
