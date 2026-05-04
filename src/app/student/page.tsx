'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import type { Diploma } from '@/types';

const navItems = [
  { label: 'Dashboard', href: '/student', icon: 'dashboard' },
  { label: 'My Diplomas', href: '/student/diplomas', icon: 'diploma' },
  { label: 'Share', href: '/student/share', icon: 'share' },
];

export default function StudentDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'student')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === 'student') {
      fetch('/api/diplomas').then(r => r.json()).then(setDiplomas).catch(() => {});
    }
  }, [user]);

  if (isLoading || !user) return null;

  return (
    <DashboardLayout title="Student Portal" navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome, {user.name}</h1>
          <p className="text-dark-400 text-sm mt-1">Manage your academic credentials</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5">
            <p className="text-dark-400 text-sm">Total Diplomas</p>
            <p className="text-3xl font-bold text-primary-400 mt-2">{diplomas.length}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-dark-400 text-sm">Valid</p>
            <p className="text-3xl font-bold text-gold-400 mt-2">{diplomas.filter(d => d.status === 'valid').length}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-dark-400 text-sm">Wallet</p>
            <p className="text-sm font-mono text-dark-300 mt-3">{user.walletAddress ? `${user.walletAddress.slice(0, 10)}...${user.walletAddress.slice(-6)}` : 'Not connected'}</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-white font-semibold mb-4">My Diplomas</h3>
          {diplomas.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-dark-500">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                </svg>
              </div>
              <p className="text-dark-500 text-sm">No diplomas yet</p>
              <p className="text-dark-600 text-xs mt-1">Your diplomas will appear here once issued by your university</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diplomas.map((d) => (
                <div key={d.id} className="p-4 rounded-xl bg-dark-800/50 border border-dark-700/30">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-medium">{d.degree}</p>
                      <p className="text-dark-400 text-sm">{d.field}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      d.status === 'valid'
                        ? 'bg-primary-700/20 text-primary-400 border border-primary-700/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                      {d.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-dark-500">
                    <p>University: {d.universityName}</p>
                    <p>Issued: {new Date(d.issuedAt).toLocaleDateString()}</p>
                    <p className="font-mono">ID: {d.diplomaId}</p>
                  </div>
                  <button
                    onClick={() => router.push('/student/share')}
                    className="mt-3 text-primary-400 text-xs hover:underline"
                  >
                    Share this diploma →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
