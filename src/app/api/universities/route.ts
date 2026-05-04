import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { addUniversity, getAllUniversities } from '@/lib/store';
import { authenticateRequest, requireRole } from '@/lib/apiAuth';

export async function GET(request: Request) {
  const auth = authenticateRequest(request);
  if (auth instanceof NextResponse) return auth;

  return NextResponse.json(getAllUniversities());
}

export async function POST(request: Request) {
  const auth = authenticateRequest(request);
  if (auth instanceof NextResponse) return auth;

  const roleCheck = requireRole(auth, 'ministry');
  if (roleCheck) return roleCheck;

  try {
    const { name, walletAddress, location, website } = await request.json();

    if (!name || !walletAddress) {
      return NextResponse.json({ error: 'Name and wallet address are required' }, { status: 400 });
    }

    const university = addUniversity({
      id: uuidv4(),
      name,
      address: location || '',
      walletAddress,
      isAuthorized: false,
      registeredAt: new Date().toISOString(),
      location,
      website,
    });

    return NextResponse.json(university);
  } catch {
    return NextResponse.json({ error: 'Failed to register university' }, { status: 500 });
  }
}
