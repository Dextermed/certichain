import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import type { UserRole } from '@/types';

interface AuthResult {
  userId: string;
  email: string;
  role: UserRole;
  walletAddress?: string;
}

export function authenticateRequest(request: Request): AuthResult | NextResponse {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  return payload as AuthResult;
}

export function requireRole(auth: AuthResult, ...roles: UserRole[]): NextResponse | null {
  if (!roles.includes(auth.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }
  return null;
}
