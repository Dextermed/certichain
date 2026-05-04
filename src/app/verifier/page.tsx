'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface VerificationResult {
  isAuthentic: boolean;
  isIntegral: boolean;
  isValid: boolean;
  diploma?: {
    diplomaId: string;
    studentName: string;
    universityName: string;
    degree: string;
    field: string;
    graduationDate: string;
    status: string;
    issuedAt: string;
    cid: string;
  };
  message: string;
}

export default function VerifierPage() {
  const [diplomaId, setDiplomaId] = useState('');
  const [diplomaHash, setDiplomaHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diplomaId, diplomaHash: diplomaHash || undefined }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        isAuthentic: false,
        isIntegral: false,
        isValid: false,
        message: 'Verification failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800 border border-gold-400/30 mb-6">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-400">
                <path d="M9 12l2 2 4-4" />
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
              <span className="text-gold-400 text-sm font-medium">Verification Portal</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Verify a Diploma</h1>
            <p className="text-dark-400 max-w-xl mx-auto">
              Instantly verify the authenticity, integrity, and validity of any diploma 
              issued through the CertiChain platform.
            </p>
          </div>

          <div className="glass-card p-8 mb-8">
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Diploma ID</label>
                <input
                  type="text"
                  value={diplomaId}
                  onChange={(e) => setDiplomaId(e.target.value)}
                  className="input-field font-mono"
                  placeholder="DIP-1234567890"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Diploma Hash <span className="text-dark-500">(optional — for integrity check)</span>
                </label>
                <input
                  type="text"
                  value={diplomaHash}
                  onChange={(e) => setDiplomaHash(e.target.value)}
                  className="input-field font-mono text-sm"
                  placeholder="SHA-256 hash..."
                />
              </div>
              <button
                type="submit"
                disabled={loading || !diplomaId}
                className="w-full btn-gold !py-3 text-center disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verifying...
                  </span>
                ) : 'Verify Diploma'}
              </button>
            </form>
          </div>

          {result && (
            <div className="glass-card p-8 animate-fade-in">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  result.isAuthentic && result.isValid
                    ? 'bg-primary-700/20'
                    : 'bg-red-500/10'
                }`}>
                  {result.isAuthentic && result.isValid ? (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-400">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <polyline points="22,4 12,14.01 9,11.01" />
                    </svg>
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  )}
                </div>
                <h3 className={`text-xl font-bold ${result.isAuthentic && result.isValid ? 'text-primary-400' : 'text-red-400'}`}>
                  {result.message}
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Authenticity', value: result.isAuthentic, desc: 'Signature verified' },
                  { label: 'Integrity', value: result.isIntegral, desc: 'Hash matches' },
                  { label: 'Validity', value: result.isValid, desc: 'Not revoked' },
                ].map((check) => (
                  <div key={check.label} className={`p-4 rounded-xl text-center ${
                    check.value
                      ? 'bg-primary-700/10 border border-primary-700/30'
                      : 'bg-red-500/5 border border-red-500/20'
                  }`}>
                    <div className={`text-2xl mb-1 ${check.value ? 'text-primary-400' : 'text-red-400'}`}>
                      {check.value ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto">
                          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                          <polyline points="22,4 12,14.01 9,11.01" />
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                      )}
                    </div>
                    <p className="text-white text-sm font-medium">{check.label}</p>
                    <p className="text-dark-500 text-xs mt-0.5">{check.desc}</p>
                  </div>
                ))}
              </div>

              {result.diploma && (
                <div className="space-y-3">
                  <h4 className="text-white font-semibold text-sm">Diploma Details</h4>
                  {[
                    { label: 'Student Name', value: result.diploma.studentName },
                    { label: 'University', value: result.diploma.universityName },
                    { label: 'Degree', value: result.diploma.degree },
                    { label: 'Field of Study', value: result.diploma.field },
                    { label: 'Graduation Date', value: result.diploma.graduationDate ? new Date(result.diploma.graduationDate).toLocaleDateString() : '—' },
                    { label: 'Issued', value: new Date(result.diploma.issuedAt).toLocaleDateString() },
                    { label: 'IPFS CID', value: result.diploma.cid || '—' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center p-3 rounded-xl bg-dark-800/50">
                      <span className="text-dark-400 text-sm">{item.label}</span>
                      <span className="text-white text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-12 glass-card p-6">
            <h3 className="text-white font-semibold mb-4">How Verification Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: 'Authenticity',
                  desc: 'The university\'s digital signature is verified against their public key stored on the blockchain.',
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                },
                {
                  title: 'Integrity',
                  desc: 'The hash of the decrypted diploma JSON is recomputed and compared with the on-chain hash.',
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  ),
                },
                {
                  title: 'Validity',
                  desc: 'The diploma status is checked on the blockchain to confirm it has not been revoked.',
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <polyline points="22,4 12,14.01 9,11.01" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div key={item.title} className="p-4 rounded-xl bg-dark-800/30">
                  <div className="w-10 h-10 rounded-xl bg-gold-400/10 flex items-center justify-center text-gold-400 mb-3">
                    {item.icon}
                  </div>
                  <h4 className="text-white font-medium text-sm mb-1">{item.title}</h4>
                  <p className="text-dark-400 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
