'use client';

const steps = [
  {
    step: '01',
    title: 'Ministry Initialization',
    description: 'The Ministry deploys the smart contract on the blockchain, establishing itself as the trusted authority that manages the authorized universities registry.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'University Registration',
    description: 'Universities create wallets and submit their addresses to the Ministry. After verification, they are added to the on-chain whitelist with unique IDs.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 20h20M5 20V10l7-5 7 5v10M9 20v-4h6v4" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Student Enrollment',
    description: 'Students create accounts with their wallets. Universities validate their academic information and link their public address to their identity.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <polyline points="17,11 19,13 23,9" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Diploma Issuance',
    description: 'The university creates an E-Diploma JSON, encrypts it with AES, signs the hash, uploads to IPFS, and registers the hash + CID on the blockchain.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
  },
  {
    step: '05',
    title: 'Secure Sharing',
    description: 'Students share their diploma by providing the CID, signature, and the symmetric key encrypted for the verifier\'s public key. No plaintext key sharing.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
  },
  {
    step: '06',
    title: 'Verification',
    description: 'Verifiers check authenticity (signature), integrity (hash comparison), and status (valid/revoked) — all verified against the immutable blockchain record.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22,4 12,14.01 9,11.01" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <span className="text-gold-400 text-sm font-semibold tracking-wider uppercase">Process</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
            How It Works
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto">
            From ministry initialization to instant verification — a secure, transparent flow 
            ensuring every credential is trustworthy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item, i) => (
            <div key={item.step} className="glass-card p-6 relative" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-700/30 to-gold-400/10 flex items-center justify-center text-gold-400">
                  {item.icon}
                </div>
                <div>
                  <span className="text-gold-400 text-xs font-bold tracking-wider">STEP {item.step}</span>
                  <h3 className="text-white font-semibold text-lg mt-1 mb-2">{item.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
