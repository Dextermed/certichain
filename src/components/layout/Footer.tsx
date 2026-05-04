import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-dark-700/50 bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-gold-400 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-lg font-bold gradient-text">CertiChain</span>
            </div>
            <p className="text-dark-400 text-sm leading-relaxed">
              Blockchain-based certificate verification platform by the Ministry of Higher Education — Algeria.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Platform</h4>
            <div className="space-y-2">
              <Link href="/#features" className="block text-dark-400 hover:text-primary-400 transition-colors text-sm">Features</Link>
              <Link href="/#how-it-works" className="block text-dark-400 hover:text-primary-400 transition-colors text-sm">How It Works</Link>
              <Link href="/verifier" className="block text-dark-400 hover:text-primary-400 transition-colors text-sm">Verify Diploma</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Portals</h4>
            <div className="space-y-2">
              <Link href="/login" className="block text-dark-400 hover:text-primary-400 transition-colors text-sm">Ministry Portal</Link>
              <Link href="/login" className="block text-dark-400 hover:text-primary-400 transition-colors text-sm">University Portal</Link>
              <Link href="/login" className="block text-dark-400 hover:text-primary-400 transition-colors text-sm">Student Portal</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Technology</h4>
            <div className="space-y-2">
              <span className="block text-dark-400 text-sm">Ethereum (Sepolia)</span>
              <span className="block text-dark-400 text-sm">IPFS (Pinata)</span>
              <span className="block text-dark-400 text-sm">AES-256 Encryption</span>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-dark-500 text-xs">
            &copy; {new Date().getFullYear()} CertiChain — Ministry of Higher Education, Algeria. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-dark-600 text-xs">Powered by Blockchain Technology</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
