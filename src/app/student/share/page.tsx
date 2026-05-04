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

export default function ShareDiplomaPage() {
  const { user, isLoading, authFetch } = useAuth();
  const router = useRouter();
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [selectedDiploma, setSelectedDiploma] = useState('');
  const [verifierAddress, setVerifierAddress] = useState('');
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'student')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === 'student') {
      authFetch(`/api/diplomas?studentId=${user.id}`).then(r => r.json()).then(setDiplomas).catch(() => {});
    }
  }, [user]);

  const handleShare = () => {
    if (!selectedDiploma || !verifierAddress) return;
    setShared(true);
  };

  if (isLoading || !user) return null;

  const diploma = diplomas.find(d => d.diplomaId === selectedDiploma);

  return (
    <DashboardLayout title="Student Portal" navItems={navItems}>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white">Share Diploma</h1>
          <p className="text-dark-400 text-sm mt-1">Securely share your credentials with a verifier</p>
        </div>

        <div className="glass-card p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Select Diploma</label>
              <select
                value={selectedDiploma}
                onChange={(e) => { setSelectedDiploma(e.target.value); setShared(false); }}
                className="input-field"
              >
                <option value="">Choose a diploma</option>
                {diplomas.map((d) => (
                  <option key={d.id} value={d.diplomaId}>
                    {d.degree} — {d.field} ({d.diplomaId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Verifier&apos;s Wallet Address</label>
              <input
                type="text"
                value={verifierAddress}
                onChange={(e) => { setVerifierAddress(e.target.value); setShared(false); }}
                className="input-field font-mono text-sm"
                placeholder="0x..."
              />
              <p className="text-dark-500 text-xs mt-1">
                The AES key is encrypted using NaCl public-key encryption (Curve25519-XSalsa20-Poly1305)
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gold-400/5 border border-gold-400/20">
              <p className="text-gold-400 text-sm font-medium mb-2">Sharing Process:</p>
              <ol className="text-dark-400 text-xs space-y-1 list-decimal list-inside">
                <li>The AES key is encrypted with NaCl public-key encryption (Curve25519)</li>
                <li>The CID, signature, and encrypted key are sent to the verifier</li>
                <li>The verifier decrypts using their NaCl private key</li>
                <li>No plaintext key is ever shared — true asymmetric encryption</li>
              </ol>
            </div>

            <button
              onClick={handleShare}
              disabled={!selectedDiploma || !verifierAddress}
              className="btn-gold text-sm !py-2.5 disabled:opacity-50"
            >
              Share Securely
            </button>
          </div>
        </div>

        {shared && diploma && (
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-700/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-400">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22,4 12,14.01 9,11.01" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Diploma Shared Successfully</h3>
                <p className="text-dark-400 text-xs">The verifier can now access your encrypted diploma</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-dark-800/50">
                <span className="text-dark-500 text-xs">Diploma ID</span>
                <p className="text-primary-400 text-sm font-mono">{diploma.diplomaId}</p>
              </div>
              <div className="p-3 rounded-xl bg-dark-800/50">
                <span className="text-dark-500 text-xs">CID</span>
                <p className="text-primary-400 text-sm font-mono break-all">{diploma.cid || 'Pending'}</p>
              </div>
              <div className="p-3 rounded-xl bg-dark-800/50">
                <span className="text-dark-500 text-xs">Shared With</span>
                <p className="text-primary-400 text-sm font-mono">{verifierAddress}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
