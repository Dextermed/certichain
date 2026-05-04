'use client';

const features = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    title: 'Blockchain Security',
    description: 'Every diploma is registered on the Ethereum blockchain, creating an immutable and tamper-proof record that can never be altered or deleted.',
    color: 'primary',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      </svg>
    ),
    title: 'Decentralized Storage',
    description: 'Encrypted diploma data is stored on IPFS via Pinata, ensuring decentralized, censorship-resistant storage with content-addressed retrieval.',
    color: 'gold',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'End-to-End Encryption',
    description: 'AES-256 symmetric encryption protects diploma content. Keys are encrypted per-recipient using public key cryptography — no plaintext key sharing.',
    color: 'primary',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22,4 12,14.01 9,11.01" />
      </svg>
    ),
    title: 'Instant Verification',
    description: 'Employers and institutions can instantly verify diploma authenticity, integrity, and status through the blockchain — no intermediaries needed.',
    color: 'gold',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <polyline points="17,11 19,13 23,9" />
      </svg>
    ),
    title: 'Role-Based Access',
    description: 'Dedicated portals for the Ministry, Universities, Students, and Verifiers — each with tailored functionality and appropriate permissions.',
    color: 'primary',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M15 7h3a5 5 0 015 5 5 5 0 01-5 5h-3m-6 0H6a5 5 0 01-5-5 5 5 0 015-5h3" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    title: 'Digital Signatures',
    description: 'Universities digitally sign each diploma hash, ensuring cryptographic proof of authenticity that can be verified against the blockchain.',
    color: 'gold',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-700/50 to-transparent" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <span className="text-gold-400 text-sm font-semibold tracking-wider uppercase">Features</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
            Built for Trust &amp; Transparency
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto">
            A comprehensive platform combining blockchain, encryption, and decentralized storage 
            to create an unbreakable chain of trust for academic credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="glass-card p-6 group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                feature.color === 'primary' 
                  ? 'bg-primary-700/20 text-primary-400' 
                  : 'bg-gold-400/10 text-gold-400'
              } group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-dark-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
