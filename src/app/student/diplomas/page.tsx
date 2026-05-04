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

export default function StudentDiplomasPage() {
  const { user, isLoading, authFetch } = useAuth();
  const router = useRouter();
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);

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

  if (isLoading || !user) return null;

  return (
    <DashboardLayout title="Student Portal" navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Diplomas</h1>
          <p className="text-dark-400 text-sm mt-1">View all your verified academic credentials</p>
        </div>

        {diplomas.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-4">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-dark-500">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
            </div>
            <p className="text-dark-400">No diplomas found</p>
            <p className="text-dark-600 text-sm mt-1">Your university will issue your diplomas which will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {diplomas.map((d) => (
              <div key={d.id} className="glass-card p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold text-lg">{d.degree}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        d.status === 'valid'
                          ? 'bg-primary-700/20 text-primary-400 border border-primary-700/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {d.status}
                      </span>
                    </div>
                    <p className="text-dark-300">{d.field}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-dark-500 text-xs">University</p>
                        <p className="text-dark-300 text-sm">{d.universityName}</p>
                      </div>
                      <div>
                        <p className="text-dark-500 text-xs">Graduation</p>
                        <p className="text-dark-300 text-sm">{d.graduationDate ? new Date(d.graduationDate).toLocaleDateString() : '—'}</p>
                      </div>
                      <div>
                        <p className="text-dark-500 text-xs">Diploma ID</p>
                        <p className="text-dark-300 text-xs font-mono">{d.diplomaId}</p>
                      </div>
                      <div>
                        <p className="text-dark-500 text-xs">IPFS CID</p>
                        <p className="text-dark-300 text-xs font-mono">{d.cid ? `${d.cid.slice(0, 16)}...` : '—'}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/student/share')}
                    className="btn-primary text-sm !py-2 !px-4 flex-shrink-0"
                  >
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
