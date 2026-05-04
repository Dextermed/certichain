import { NextResponse } from 'next/server';
import { comparePassword, generateToken } from '@/lib/auth';
import { getUserByEmail } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

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
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
