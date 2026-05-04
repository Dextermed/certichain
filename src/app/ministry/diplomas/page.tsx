'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import type { Diploma } from '@/types';

const navItems = [
  { label: 'Dashboard', href: '/ministry', icon: 'dashboard' },
  { label: 'Universities', href: '/ministry/universities', icon: 'university' },
  { label: 'All Diplomas', href: '/ministry/diplomas', icon: 'diploma' },
];

export default function AllDiplomasPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ministry')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    fetch('/api/diplomas').then(r => r.json()).then(setDiplomas).catch(() => {});
  }, []);

  if (isLoading || !user) return null;

  return (
    <DashboardLayout title="Ministry Portal" navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">All Diplomas</h1>
          <p className="text-dark-400 text-sm mt-1">View all diplomas issued across universities</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4">
            <p className="text-dark-400 text-sm">Total</p>
            <p className="text-2xl font-bold text-white mt-1">{diplomas.length}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-dark-400 text-sm">Valid</p>
            <p className="text-2xl font-bold text-primary-400 mt-1">{diplomas.filter(d => d.status === 'valid').length}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-dark-400 text-sm">Revoked</p>
            <p className="text-2xl font-bold text-red-400 mt-1">{diplomas.filter(d => d.status === 'revoked').length}</p>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700/50">
                  <th className="text-left text-xs text-dark-400 font-medium p-4">Diploma ID</th>
                  <th className="text-left text-xs text-dark-400 font-medium p-4">Student</th>
                  <th className="text-left text-xs text-dark-400 font-medium p-4">University</th>
                  <th className="text-left text-xs text-dark-400 font-medium p-4">Degree</th>
                  <th className="text-left text-xs text-dark-400 font-medium p-4">Status</th>
                  <th className="text-left text-xs text-dark-400 font-medium p-4">Issued</th>
                </tr>
              </thead>
              <tbody>
                {diplomas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-dark-500 text-sm">
                      No diplomas issued yet
                    </td>
                  </tr>
                ) : (
                  diplomas.map((d) => (
                    <tr key={d.id} className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
                      <td className="p-4 text-dark-300 text-xs font-mono">{d.diplomaId}</td>
                      <td className="p-4 text-white text-sm">{d.studentName}</td>
                      <td className="p-4 text-dark-300 text-sm">{d.universityName}</td>
                      <td className="p-4 text-dark-300 text-sm">{d.degree} — {d.field}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          d.status === 'valid'
                            ? 'bg-primary-700/20 text-primary-400 border border-primary-700/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="p-4 text-dark-400 text-sm">{new Date(d.issuedAt).toLocaleDateString()}</td>
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
