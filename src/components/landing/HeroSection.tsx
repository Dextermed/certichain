'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800 border border-primary-700/30 mb-8">
            <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            <span className="text-primary-400 text-sm font-medium">Blockchain-Powered Verification</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <span className="text-white">Secure Digital</span>
          <br />
          <span className="gradient-text">Certificate Verification</span>
        </h1>

        <p className="text-dark-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 animate-slide-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
          The official platform of the Ministry of Higher Education — Algeria. 
          Issue, manage, and verify academic credentials using blockchain technology, 
          IPFS storage, and advanced cryptographic security.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Link href="/register" className="btn-primary text-lg !py-3.5 !px-8 inline-flex items-center justify-center gap-2">
            Get Started
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="/verifier" className="btn-gold text-lg !py-3.5 !px-8 inline-flex items-center justify-center gap-2">
            Verify a Diploma
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4" />
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
          {[
            { value: 'Tamper-Proof', label: 'Blockchain Records' },
            { value: 'Encrypted', label: 'IPFS Storage' },
            { value: 'Instant', label: 'Verification' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-primary-400 font-bold text-lg md:text-xl">{stat.value}</p>
              <p className="text-dark-500 text-xs md:text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
