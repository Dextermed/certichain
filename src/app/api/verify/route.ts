import { NextResponse } from 'next/server';
import { getDiplomaByDiplomaId } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const { diplomaId, diplomaHash } = await request.json();

    if (!diplomaId) {
      return NextResponse.json({ error: 'Diploma ID is required' }, { status: 400 });
    }

    const diploma = getDiplomaByDiplomaId(diplomaId);

    if (!diploma) {
      return NextResponse.json({
        isAuthentic: false,
        isIntegral: false,
        isValid: false,
        message: 'Diploma not found in the system',
      });
    }

    const isIntegral = diplomaHash ? diploma.diplomaHash === diplomaHash : true;

    return NextResponse.json({
      isAuthentic: true,
      isIntegral,
      isValid: diploma.status === 'valid',
      diploma: {
        diplomaId: diploma.diplomaId,
        studentName: diploma.studentName,
        universityName: diploma.universityName,
        degree: diploma.degree,
        field: diploma.field,
        graduationDate: diploma.graduationDate,
        status: diploma.status,
        issuedAt: diploma.issuedAt,
        cid: diploma.cid,
      },
      message: diploma.status === 'valid'
        ? 'Diploma is authentic and valid'
        : 'Diploma has been revoked',
    });
  } catch {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
