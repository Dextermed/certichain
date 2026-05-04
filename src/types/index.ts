export type UserRole = 'ministry' | 'university' | 'student' | 'verifier';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  walletAddress?: string;
  universityId?: string;
  studentId?: string;
  createdAt: string;
}

export interface University {
  id: string;
  name: string;
  address: string;
  walletAddress: string;
  isAuthorized: boolean;
  registeredAt: string;
  location?: string;
  website?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  universityId: string;
  nationalId?: string;
  verified: boolean;
  registeredAt: string;
}

export interface Diploma {
  id: string;
  diplomaId: string;
  studentId: string;
  universityId: string;
  studentName: string;
  universityName: string;
  degree: string;
  field: string;
  graduationDate: string;
  cid: string;
  diplomaHash: string;
  status: 'valid' | 'revoked' | 'pending';
  issuedAt: string;
  txHash?: string;
}

export interface VerificationResult {
  isAuthentic: boolean;
  isIntegral: boolean;
  isValid: boolean;
  diploma?: Diploma;
  universityName?: string;
  message: string;
}

export interface DiplomaJSON {
  studentName: string;
  studentId: string;
  universityName: string;
  universityId: string;
  degree: string;
  field: string;
  specialization?: string;
  graduationDate: string;
  honors?: string;
  gpa?: string;
  issuedAt: string;
}
