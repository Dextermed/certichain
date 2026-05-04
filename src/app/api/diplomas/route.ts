import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { addDiploma, getAllDiplomas, getDiplomasByStudent, getDiplomasByUniversity } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  const universityId = searchParams.get('universityId');

  if (studentId) {
    return NextResponse.json(getDiplomasByStudent(studentId));
  }
  if (universityId) {
    return NextResponse.json(getDiplomasByUniversity(universityId));
  }

  return NextResponse.json(getAllDiplomas());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, universityId, studentName, universityName, degree, field, graduationDate, cid, diplomaHash, txHash } = body;

    if (!studentId || !universityId || !degree || !field) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const diploma = addDiploma({
      id: uuidv4(),
      diplomaId: `DIP-${Date.now()}`,
      studentId,
      universityId,
      studentName: studentName || '',
      universityName: universityName || '',
      degree,
      field,
      graduationDate: graduationDate || new Date().toISOString(),
      cid: cid || '',
      diplomaHash: diplomaHash || '',
      status: 'valid',
      issuedAt: new Date().toISOString(),
      txHash,
    });

    return NextResponse.json(diploma);
  } catch {
    return NextResponse.json({ error: 'Failed to create diploma' }, { status: 500 });
  }
}
