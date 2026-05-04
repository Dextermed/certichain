'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import type { Diploma } from '@/types';

const navItems = [
  { label: 'Dashboard', href: '/university', icon: 'dashboard' },
  { label: 'Students', href: '/university/students', icon: 'students' },
  { label: 'Issue Diploma', href: '/university/issue', icon: 'diploma' },
  { label: 'Diplomas', href: '/university/diplomas', icon: 'verify' },
];

export default function UniversityDiplomasPage() {
  const { user, isLoading, authFetch } = useAuth();
  const router = useRouter();
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'university')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === 'university') {
      authFetch(`/api/diplomas?universityId=${user.id}`).then(r => r.json()).then(setDiplomas).catch(() => {});
    }
  }, [user]);

  if (isLoading || !user) return null;

  return (
    <DashboardLayout title="University Portal" navItems={navItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Issued Diplomas</h1>
            <p className="text-dark-400 text-sm mt-1">View and manage all diplomas issued by your university</p>
          </div>
          <button onClick={() => router.push('/university/issue')} className="btn-primary text-sm !py-2 !px-4">
            + Issue New Diploma
          </button>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700/50">
                  <th className="text-left text-xs text-dark-400 font-medium p-4">Diploma ID</th>
                  <th className="text-left text-xs text-dark-400 font-medium p-4">Student</th>
                  <th className="text-left text-xs text-dark-400 font-medium p-4">Degree</th>
                  <th className="text-left text-xs text-dark-400 font-medium p-4">Field</th>
                  <th className="text-left text-xs text-dark-400 font-medium p-4">Status</th>
                  <th className="text-left text-xs text-dark-400 font-medium p-4">CID</th>
                  <th className="text-left text-xs text-dark-400 font-medium p-4">Issued</th>
                </tr>
              </thead>
              <tbody>
                {diplomas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-dark-500 text-sm">
                      No diplomas issued yet. Click &quot;Issue New Diploma&quot; to create one.
                    </td>
                  </tr>
                ) : (
                  diplomas.map((d) => (
                    <tr key={d.id} className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
                      <td className="p-4 text-dark-300 text-xs font-mono">{d.diplomaId}</td>
                      <td className="p-4 text-white text-sm">{d.studentName}</td>
                      <td className="p-4 text-dark-300 text-sm">{d.degree}</td>
                      <td className="p-4 text-dark-300 text-sm">{d.field}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          d.status === 'valid'
                            ? 'bg-primary-700/20 text-primary-400 border border-primary-700/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="p-4 text-dark-500 text-xs font-mono">{d.cid ? `${d.cid.slice(0, 12)}...` : '—'}</td>
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
