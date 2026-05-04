'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import type { Student } from '@/types';

const navItems = [
  { label: 'Dashboard', href: '/university', icon: 'dashboard' },
  { label: 'Students', href: '/university/students', icon: 'students' },
  { label: 'Issue Diploma', href: '/university/issue', icon: 'diploma' },
  { label: 'Diplomas', href: '/university/diplomas', icon: 'verify' },
];

export default function StudentsPage() {
  const { user, isLoading, authFetch } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', walletAddress: '', nationalId: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'university')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === 'university') {
      fetchStudents();
    }
  }, [user]);

  const fetchStudents = () => {
    if (user?.id) {
      authFetch(`/api/students?universityId=${user.id}`).then(r => r.json()).then(setStudents).catch(() => {});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await authFetch('/api/students', {
        method: 'POST',
        body: JSON.stringify({ ...formData, universityId: user?.id }),
      });
      if (res.ok) {
        setFormData({ name: '', email: '', walletAddress: '', nationalId: '' });
        setShowForm(false);
        fetchStudents();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !user) return null;

  return (
    <DashboardLayout title="University Portal" navItems={navItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Students</h1>
            <p className="text-dark-400 text-sm mt-1">Manage student registrations and verification</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm !py-2 !px-4">
            {showForm ? 'Cancel' : '+ Register Student'}
          </button>
        </div>

        {showForm && (
          <div className="glass-card p-6">
            <h3 className="text-white font-semibold mb-4">Register New Student</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-dark-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="input-field"
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
                <label className="block text-sm text-dark-300 mb-1">National ID</label>
                <input
                  type="text"
                  value={formData.nationalId}
                  onChange={(e) => setFormData(prev => ({ ...prev, nationalId: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={submitting} className="btn-primary text-sm !py-2.5 disabled:opacity-50">
                  {submitting ? 'Registering...' : 'Register Student'}
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
                  <th className="text-left text-xs text-dark-400 font-medium p-4">Email</th>
                  <th className="text-left text-xs text-dark-400 font-medium p-4">Wallet</th>
                  <th className="text-left text-xs text-dark-400 font-medium p-4">Status</th>
                  <th className="text-left text-xs text-dark-400 font-medium p-4">Registered</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-dark-500 text-sm">
                      No students registered yet
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s.id} className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
                      <td className="p-4 text-white text-sm font-medium">{s.name}</td>
                      <td className="p-4 text-dark-300 text-sm">{s.email}</td>
                      <td className="p-4 text-dark-300 text-xs font-mono">{s.walletAddress?.slice(0, 8)}...{s.walletAddress?.slice(-6)}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          s.verified
                            ? 'bg-primary-700/20 text-primary-400 border border-primary-700/30'
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {s.verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 text-dark-400 text-sm">{new Date(s.registeredAt).toLocaleDateString()}</td>
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
