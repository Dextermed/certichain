'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const roles = [
  { value: 'university', label: 'University', description: 'Academic institution issuing diplomas' },
  { value: 'student', label: 'Student', description: 'Diploma holder and credential owner' },
  { value: 'verifier', label: 'Verifier', description: 'Employer or institution verifying credentials' },
];

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ name, email, password, role, walletAddress });
      switch (role) {
        case 'ministry': router.push('/ministry'); break;
        case 'university': router.push('/university'); break;
        case 'student': router.push('/student'); break;
        case 'verifier': router.push('/verifier'); break;
        default: router.push('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-gold-400 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-2xl font-bold gradient-text">CertiChain</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-dark-400 text-sm mt-1">Join the certificate verification platform</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Select Your Role</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      role === r.value
                        ? 'bg-primary-700/20 border border-primary-500/50 text-primary-400'
                        : 'bg-dark-800/50 border border-dark-700/50 text-dark-400 hover:border-dark-600'
                    }`}
                  >
                    <p className="font-medium text-sm">{r.label}</p>
                    <p className="text-xs mt-0.5 opacity-70">{r.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Wallet Address <span className="text-dark-500">(optional)</span>
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="input-field font-mono text-sm"
                placeholder="0x..."
              />
              <p className="text-dark-500 text-xs mt-1">Connect your MetaMask wallet address for blockchain interactions</p>
            </div>

            <button
              type="submit"
              disabled={loading || !role}
              className="w-full btn-primary !py-3 text-center disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-400 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
