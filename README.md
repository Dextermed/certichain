# CertiChain — Blockchain-Based Certificate Verification

Official platform of the **Ministry of Higher Education — Algeria** for issuing, managing, and verifying academic credentials using blockchain technology.

## Architecture

- **Blockchain**: Ethereum (Sepolia testnet) — immutable diploma records (hash + status)
- **Storage**: IPFS via Pinata — decentralized encrypted diploma storage
- **Encryption**: AES-256 symmetric encryption with public-key key exchange
- **Signatures**: Digital signatures for authenticity verification
- **Frontend**: Next.js + React + Tailwind CSS

## Portals

| Portal | Role | Description |
|--------|------|-------------|
| **Ministry** | Government Authority | Deploy contracts, whitelist universities, platform oversight |
| **University** | Academic Institution | Register students, issue & sign diplomas, manage credentials |
| **Student** | Credential Owner | View diplomas, share securely with verifiers |
| **Verifier** | Employer/Institution | Verify authenticity, integrity, and validity of diplomas |

## Getting Started

### Prerequisites

- Node.js 18+
- MetaMask wallet
- Pinata account (for IPFS)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_ALCHEMY_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs

PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
PINATA_JWT=your_pinata_jwt

JWT_SECRET=your_jwt_secret
```

### Run Development Server

```bash
npm run dev
```

### Deploy Smart Contract

```bash
npx hardhat compile
DEPLOYER_PRIVATE_KEY=your_key npx hardhat run scripts/deploy.ts --network sepolia
```

## Flow

1. **Ministry** deploys the smart contract and whitelists universities
2. **Universities** register students and issue encrypted E-Diplomas
3. **Students** receive diplomas and can share them securely
4. **Verifiers** check authenticity, integrity, and validity on-chain

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- Solidity 0.8.19
- ethers.js v6
- Pinata (IPFS)
- CryptoJS (AES encryption)
