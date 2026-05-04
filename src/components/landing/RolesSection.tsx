'use client';

import Link from 'next/link';

const roles = [
  {
    title: 'Ministry',
    description: 'Deploy smart contracts, whitelist universities, manage the platform, and oversee the entire certification ecosystem.',
    features: ['Deploy & manage smart contracts', 'Authorize universities', 'Platform oversight', 'Revocation authority'],
    color: 'primary',
    link: '/register',
  },
  {
    title: 'University',
    description: 'Register students, issue and sign digital diplomas, upload to IPFS, and record on the blockchain.',
    features: ['Register & verify students', 'Issue E-Diplomas', 'Digital signatures', 'Batch diploma issuance'],
    color: 'gold',
    link: '/register',
  },
  {
    title: 'Student',
    description: 'View your verified diplomas, share them securely with employers, and control access to your credentials.',
    features: ['View certified diplomas', 'Secure sharing', 'Key management', 'Access control'],
    color: 'primary',
    link: '/register',
  },
  {
    title: 'Verifier',
    description: 'Instantly verify diploma authenticity, integrity, and validity against the blockchain — no account required.',
    features: ['Authenticity check', 'Integrity verification', 'Status validation', 'No registration needed'],
    color: 'gold',
    link: '/verifier',
  },
];

export default function RolesSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-700/50 to-transparent" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <span className="text-gold-400 text-sm font-semibold tracking-wider uppercase">Portals</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
            Role-Based Access
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto">
            Each participant in the ecosystem has a dedicated portal with tailored functionality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div key={role.title} className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm ${
                  role.color === 'primary' ? 'bg-primary-700/40' : 'bg-gold-400/20'
                }`}>
                  {role.title.charAt(0)}
                </div>
                <h3 className="text-white font-semibold text-xl">{role.title}</h3>
              </div>
              <p className="text-dark-400 text-sm mb-4 leading-relaxed">{role.description}</p>
              <ul className="space-y-2 mb-6">
                {role.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-dark-300 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary-400 flex-shrink-0">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={role.link} className={`inline-block text-sm font-medium ${
                role.color === 'primary' ? 'btn-primary' : 'btn-gold'
              } !py-2 !px-5`}>
                {role.title === 'Verifier' ? 'Verify Now' : 'Access Portal'}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
