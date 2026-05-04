'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'ministry': return '/ministry';
      case 'university': return '/university';
      case 'student': return '/student';
      case 'verifier': return '/verifier';
      default: return '/';
    }
  };

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-gold-400 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold gradient-text">CertiChain</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-dark-300 hover:text-primary-400 transition-colors text-sm">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-dark-300 hover:text-primary-400 transition-colors text-sm">
              How It Works
            </Link>
            <Link href="/verifier" className="text-dark-300 hover:text-primary-400 transition-colors text-sm">
              Verify Diploma
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link href={getDashboardLink()} className="text-primary-400 font-medium text-sm">
                  Dashboard
                </Link>
                <span className="text-dark-400 text-xs px-2 py-1 rounded-full bg-dark-800 border border-primary-700/30">
                  {user.role}
                </span>
                <button onClick={logout} className="text-dark-400 hover:text-red-400 transition-colors text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-dark-300 hover:text-white transition-colors text-sm">
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary text-sm !py-2 !px-4">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-dark-300 hover:text-white"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-dark-700/50 mt-2 pt-4 space-y-3">
            <Link href="/#features" className="block text-dark-300 hover:text-primary-400 text-sm" onClick={() => setMobileOpen(false)}>
              Features
            </Link>
            <Link href="/#how-it-works" className="block text-dark-300 hover:text-primary-400 text-sm" onClick={() => setMobileOpen(false)}>
              How It Works
            </Link>
            <Link href="/verifier" className="block text-dark-300 hover:text-primary-400 text-sm" onClick={() => setMobileOpen(false)}>
              Verify Diploma
            </Link>
            {user ? (
              <>
                <Link href={getDashboardLink()} className="block text-primary-400 font-medium text-sm" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="block text-dark-400 hover:text-red-400 text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-dark-300 text-sm" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
                <Link href="/register" className="block btn-primary text-sm text-center !py-2" onClick={() => setMobileOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
