'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import type { University } from '@/types';

const navItems = [
  { label: 'Dashboard', href: '/ministry', icon: 'dashboard' },
  { label: 'Universities', href: '/ministry/universities', icon: 'university' },
  { label: 'All Diplomas', href: '/ministry/diplomas', icon: 'diploma' },
];

export default function UniversitiesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', walletAddress: '', location: '', website: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ministry')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = () => {
    fetch('/api/universities').then(r => r.json()).then(setUniversities).catch(() => {});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ name: '', walletAddress: '', location: '', website: '' });
        setShowForm(false);
        fetchUniversities();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !user) return null;

  return (
    <DashboardLayout title="Ministry Portal" navItems={navItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Universities</h1>
            <p className="text-dark-400 text-sm mt-1">Manage registered universities and their authorization</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm !py-2 !px-4">
            {showForm ? 'Cancel' : '+ Register University'}
          </button>
        </div>

        {showForm && (
          <div className="glass-card p-6">
            <h3 className="text-white font-semibold mb-4">Register New University</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-dark-300 mb-1">University Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  placeholder="University of Algiers"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-1">Wallet Address</label>
                <input
                  type="text"
                  value={formData.walletAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, walletAddress: e.target.value }))}
                  className="input-field font-mono text-sm"
                  placeholder="0x..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="input-field"
                  placeholder="Algiers, Algeria"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-1">Website</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={submitting} className="btn-primary text-sm !py-2.5 disabled:opacity-50">
                  {submitting ? 'Registering...' : 'Register University'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700/50">
                  <th className="text-left text-xs text-dark-400 font-medium p-4">Name</th>
                  <th className="text-left text-xs text-dark-400 font-medium p-4">Wallet Address</th>
                  <th className="text-left text-xs text-dark-400 font-medium p-4">Location</th>
                  <th className="text-left text-xs text-dark-400 font-medium p-4">Status</th>
                  <th className="text-left text-xs text-dark-400 font-medium p-4">Registered</th>
                </tr>
              </thead>
              <tbody>
                {universities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-dark-500 text-sm">
                      No universities registered yet
                    </td>
                  </tr>
                ) : (
                  universities.map((uni) => (
                    <tr key={uni.id} className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
                      <td className="p-4">
                        <p className="text-white text-sm font-medium">{uni.name}</p>
                        {uni.website && <p className="text-dark-500 text-xs">{uni.website}</p>}
                      </td>
                      <td className="p-4">
                        <span className="text-dark-300 text-xs font-mono">{uni.walletAddress?.slice(0, 8)}...{uni.walletAddress?.slice(-6)}</span>
                      </td>
                      <td className="p-4 text-dark-300 text-sm">{uni.location || '—'}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          uni.isAuthorized
                            ? 'bg-primary-700/20 text-primary-400 border border-primary-700/30'
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {uni.isAuthorized ? 'Authorized' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 text-dark-400 text-sm">
                        {new Date(uni.registeredAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
