import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { addStudent, getAllStudents, getStudentsByUniversity } from '@/lib/store';
import { authenticateRequest, requireRole } from '@/lib/apiAuth';

export async function GET(request: Request) {
  const auth = authenticateRequest(request);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const universityId = searchParams.get('universityId');

  if (universityId) {
    return NextResponse.json(getStudentsByUniversity(universityId));
  }

  const roleCheck = requireRole(auth, 'ministry');
  if (roleCheck) return roleCheck;

  return NextResponse.json(getAllStudents());
}

export async function POST(request: Request) {
  const auth = authenticateRequest(request);
  if (auth instanceof NextResponse) return auth;

  const roleCheck = requireRole(auth, 'university');
  if (roleCheck) return roleCheck;

  try {
    const { name, email, walletAddress, universityId, nationalId } = await request.json();

    if (!name || !email || !walletAddress || !universityId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const student = addStudent({
      id: uuidv4(),
      name,
      email,
      walletAddress,
      universityId,
      nationalId,
      verified: false,
      registeredAt: new Date().toISOString(),
    });

    return NextResponse.json(student);
  } catch {
    return NextResponse.json({ error: 'Failed to register student' }, { status: 500 });
  }
}
