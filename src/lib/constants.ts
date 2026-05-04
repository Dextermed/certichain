export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

export const SEPOLIA_CHAIN_ID = 11155111;

export const ALCHEMY_RPC_URL = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/demo';

export const PINATA_API_KEY = process.env.PINATA_API_KEY || '';
export const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY || '';
export const PINATA_JWT = process.env.PINATA_JWT || '';
export const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs';

export const APP_NAME = 'CertiChain';
export const APP_DESCRIPTION = 'Blockchain-Based Certificate Verification Platform';
export const APP_TAGLINE = 'Ministry of Higher Education — Algeria';

export const ROLES = {
  MINISTRY: 'ministry',
  UNIVERSITY: 'university',
  STUDENT: 'student',
  VERIFIER: 'verifier',
} as const;

export const DIPLOMA_STATUS = {
  VALID: 'valid',
  REVOKED: 'revoked',
  PENDING: 'pending',
} as const;
