'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import type { Student, Diploma } from '@/types';

const navItems = [
  { label: 'Dashboard', href: '/university', icon: 'dashboard' },
  { label: 'Students', href: '/university/students', icon: 'students' },
  { label: 'Issue Diploma', href: '/university/issue', icon: 'diploma' },
  { label: 'Diplomas', href: '/university/diplomas', icon: 'verify' },
];

export default function UniversityDashboard() {
  const { user, isLoading, authFetch } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'university')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === 'university') {
      authFetch(`/api/students?universityId=${user.id}`).then(r => r.json()).then(setStudents).catch(() => {});
      authFetch(`/api/diplomas?universityId=${user.id}`).then(r => r.json()).then(setDiplomas).catch(() => {});
    }
  }, [user]);

  if (isLoading || !user) return null;

  const stats = [
    { label: 'Registered Students', value: students.length, color: 'primary' },
    { label: 'Verified Students', value: students.filter(s => s.verified).length, color: 'gold' },
    { label: 'Diplomas Issued', value: diplomas.length, color: 'primary' },
    { label: 'Valid Diplomas', value: diplomas.filter(d => d.status === 'valid').length, color: 'gold' },
  ];

  return (
    <DashboardLayout title="University Portal" navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">University Dashboard</h1>
          <p className="text-dark-400 text-sm mt-1">Manage students and issue diplomas</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-5">
              <p className="text-dark-400 text-sm">{stat.label}</p>
              <p className={`text-3xl font-bold mt-2 ${stat.color === 'primary' ? 'text-primary-400' : 'text-gold-400'}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Recent Students</h3>
              <button onClick={() => router.push('/university/students')} className="text-primary-400 text-sm hover:underline">
                View All
              </button>
            </div>
            {students.length === 0 ? (
              <p className="text-dark-500 text-sm">No students registered yet</p>
            ) : (
              <div className="space-y-3">
                {students.slice(0, 5).map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50">
                    <div>
                      <p className="text-white text-sm font-medium">{student.name}</p>
                      <p className="text-dark-500 text-xs">{student.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      student.verified
                        ? 'bg-primary-700/20 text-primary-400 border border-primary-700/30'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {student.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Recent Diplomas</h3>
              <button onClick={() => router.push('/university/diplomas')} className="text-primary-400 text-sm hover:underline">
                View All
              </button>
            </div>
            {diplomas.length === 0 ? (
              <p className="text-dark-500 text-sm">No diplomas issued yet</p>
            ) : (
              <div className="space-y-3">
                {diplomas.slice(0, 5).map((diploma) => (
                  <div key={diploma.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50">
                    <div>
                      <p className="text-white text-sm font-medium">{diploma.studentName}</p>
                      <p className="text-dark-500 text-xs">{diploma.degree} — {diploma.field}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      diploma.status === 'valid'
                        ? 'bg-primary-700/20 text-primary-400 border border-primary-700/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                      {diploma.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
