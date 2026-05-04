import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { addUniversity, getAllUniversities } from '@/lib/store';

export async function GET() {
  const universities = getAllUniversities();
  return NextResponse.json(universities);
}

export async function POST(request: Request) {
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
