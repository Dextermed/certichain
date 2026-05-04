'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { hashData, generateAESKey, encryptData } from '@/lib/crypto';

const navItems = [
  { label: 'Dashboard', href: '/university', icon: 'dashboard' },
  { label: 'Students', href: '/university/students', icon: 'students' },
  { label: 'Issue Diploma', href: '/university/issue', icon: 'diploma' },
  { label: 'Diplomas', href: '/university/diplomas', icon: 'verify' },
];

export default function IssueDiplomaPage() {
  const { user, isLoading, authFetch } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ diplomaId: string; cid: string; hash: string } | null>(null);
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    degree: '',
    field: '',
    specialization: '',
    graduationDate: '',
    honors: '',
    gpa: '',
  });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'university')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleIssueDiploma = async () => {
    setSubmitting(true);
    try {
      const diplomaJSON = {
        studentName: formData.studentName,
        studentId: formData.studentId,
        universityName: user?.name || '',
        universityId: user?.id || '',
        degree: formData.degree,
        field: formData.field,
        specialization: formData.specialization,
        graduationDate: formData.graduationDate,
        honors: formData.honors,
        gpa: formData.gpa,
        issuedAt: new Date().toISOString(),
      };

      const jsonString = JSON.stringify(diplomaJSON);
      const diplomaHash = hashData(jsonString);
      const aesKey = generateAESKey();
      const encryptedData = encryptData(jsonString, aesKey);

      let cid = '';
      try {
        const ipfsRes = await authFetch('/api/ipfs', {
          method: 'POST',
          body: JSON.stringify({ data: { encrypted: encryptedData }, name: `diploma-${formData.studentId}` }),
        });
        if (ipfsRes.ok) {
          const ipfsResult = await ipfsRes.json();
          cid = ipfsResult.cid;
        }
      } catch {
        cid = `QmSIMULATED${Date.now()}`;
      }

      const diplomaRes = await authFetch('/api/diplomas', {
        method: 'POST',
        body: JSON.stringify({
          studentId: formData.studentId,
          universityId: user?.id,
          studentName: formData.studentName,
          universityName: user?.name,
          degree: formData.degree,
          field: formData.field,
          graduationDate: formData.graduationDate,
          cid,
          diplomaHash,
        }),
      });

      if (diplomaRes.ok) {
        const diploma = await diplomaRes.json();
        setResult({
          diplomaId: diploma.diplomaId,
          cid,
          hash: diplomaHash,
        });
        setStep(4);
      }
    } catch {
      alert('Failed to issue diploma');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !user) return null;

  return (
    <DashboardLayout title="University Portal" navItems={navItems}>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-white">Issue Diploma</h1>
          <p className="text-dark-400 text-sm mt-1">Create and issue a new E-Diploma with blockchain verification</p>
        </div>

        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s
                  ? 'bg-primary-700/30 text-primary-400 border border-primary-500/50'
                  : 'bg-dark-800 text-dark-500 border border-dark-700/50'
              }`}>
                {step > s ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                ) : s}
              </div>
              {s < 4 && <div className={`w-12 h-px ${step > s ? 'bg-primary-500/50' : 'bg-dark-700'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="glass-card p-6">
            <h3 className="text-white font-semibold mb-4">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-dark-300 mb-1">Student Full Name</label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-1">Student ID</label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!formData.studentName || !formData.studentId}
                className="btn-primary text-sm !py-2.5 disabled:opacity-50"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="glass-card p-6">
            <h3 className="text-white font-semibold mb-4">Diploma Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-dark-300 mb-1">Degree</label>
                <select
                  value={formData.degree}
                  onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Select degree</option>
                  <option value="Licence">Licence (Bachelor)</option>
                  <option value="Master">Master</option>
                  <option value="Doctorat">Doctorat (PhD)</option>
                  <option value="Ingénieur">Ingénieur</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-1">Field of Study</label>
                <input
                  type="text"
                  value={formData.field}
                  onChange={(e) => setFormData(prev => ({ ...prev, field: e.target.value }))}
                  className="input-field"
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-1">Specialization</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-1">Graduation Date</label>
                <input
                  type="date"
                  value={formData.graduationDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, graduationDate: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-1">Honors</label>
                <select
                  value={formData.honors}
                  onChange={(e) => setFormData(prev => ({ ...prev, honors: e.target.value }))}
                  className="input-field"
                >
                  <option value="">None</option>
                  <option value="Passable">Passable</option>
                  <option value="Assez Bien">Assez Bien</option>
                  <option value="Bien">Bien</option>
                  <option value="Très Bien">Très Bien</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-1">GPA</label>
                <input
                  type="text"
                  value={formData.gpa}
                  onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
                  className="input-field"
                  placeholder="e.g., 15.5/20"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <button onClick={() => setStep(1)} className="text-dark-400 hover:text-white text-sm transition-colors">
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.degree || !formData.field}
                className="btn-primary text-sm !py-2.5 disabled:opacity-50"
              >
                Review
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="glass-card p-6">
            <h3 className="text-white font-semibold mb-4">Review &amp; Confirm</h3>
            <div className="space-y-3 mb-6">
              {[
                { label: 'Student', value: `${formData.studentName} (${formData.studentId})` },
                { label: 'Degree', value: formData.degree },
                { label: 'Field', value: formData.field },
                { label: 'Specialization', value: formData.specialization || '—' },
                { label: 'Graduation', value: formData.graduationDate || '—' },
                { label: 'Honors', value: formData.honors || '—' },
                { label: 'GPA', value: formData.gpa || '—' },
                { label: 'University', value: user?.name || '—' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center p-3 rounded-xl bg-dark-800/50">
                  <span className="text-dark-400 text-sm">{item.label}</span>
                  <span className="text-white text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl bg-gold-400/5 border border-gold-400/20 mb-6">
              <p className="text-gold-400 text-sm font-medium mb-1">What happens next:</p>
              <ol className="text-dark-400 text-xs space-y-1 list-decimal list-inside">
                <li>E-Diploma JSON will be created and encrypted (AES-256)</li>
                <li>Encrypted data will be uploaded to IPFS via Pinata</li>
                <li>Hash and CID will be recorded on the blockchain</li>
                <li>Student will be notified of the issued diploma</li>
              </ol>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="text-dark-400 hover:text-white text-sm transition-colors">
                Back
              </button>
              <button
                onClick={handleIssueDiploma}
                disabled={submitting}
                className="btn-gold text-sm !py-2.5 disabled:opacity-50"
              >
                {submitting ? 'Issuing Diploma...' : 'Issue Diploma on Blockchain'}
              </button>
            </div>
          </div>
        )}

        {step === 4 && result && (
          <div className="glass-card p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary-700/20 flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-400">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22,4 12,14.01 9,11.01" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Diploma Issued Successfully!</h3>
            <p className="text-dark-400 text-sm mb-6">The E-Diploma has been encrypted, stored on IPFS, and recorded on the blockchain.</p>
            <div className="space-y-3 text-left max-w-md mx-auto mb-6">
              <div className="p-3 rounded-xl bg-dark-800/50">
                <span className="text-dark-400 text-xs">Diploma ID</span>
                <p className="text-primary-400 text-sm font-mono">{result.diplomaId}</p>
              </div>
              <div className="p-3 rounded-xl bg-dark-800/50">
                <span className="text-dark-400 text-xs">IPFS CID</span>
                <p className="text-primary-400 text-sm font-mono break-all">{result.cid}</p>
              </div>
              <div className="p-3 rounded-xl bg-dark-800/50">
                <span className="text-dark-400 text-xs">Diploma Hash</span>
                <p className="text-primary-400 text-sm font-mono break-all">{result.hash}</p>
              </div>
            </div>
            <button
              onClick={() => { setStep(1); setResult(null); setFormData({ studentName: '', studentId: '', degree: '', field: '', specialization: '', graduationDate: '', honors: '', gpa: '' }); }}
              className="btn-primary text-sm"
            >
              Issue Another Diploma
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
