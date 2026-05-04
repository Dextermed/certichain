import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword, generateToken } from '@/lib/auth';
import { createUser, getUserByEmail } from '@/lib/store';
import type { UserRole } from '@/types';

export async function POST(request: Request) {
  try {
    const { name, email, password, role, walletAddress } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const validRoles: UserRole[] = ['university', 'student', 'verifier'];
    if (role === 'ministry') {
      const adminKey = request.headers.get('x-admin-key');
      const expectedKey = process.env.MINISTRY_ADMIN_KEY || 'certichain-ministry-setup';
      if (adminKey !== expectedKey) {
        return NextResponse.json({ error: 'Ministry registration requires admin authorization' }, { status: 403 });
      }
    } else if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const userId = uuidv4();

    const user = createUser({
      id: userId,
      name,
      email,
      role,
      walletAddress: walletAddress || '',
      passwordHash,
      createdAt: new Date().toISOString(),
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
        createdAt: user.createdAt,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
