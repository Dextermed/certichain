import { NextResponse } from 'next/server';

const PINATA_JWT = process.env.PINATA_JWT || '';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: JSON.stringify({
        pinataContent: body.data,
        pinataMetadata: {
          name: body.name || `certichain-${Date.now()}`,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `IPFS upload failed: ${error}` }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json({ cid: result.IpfsHash });
  } catch {
    return NextResponse.json({ error: 'IPFS upload failed' }, { status: 500 });
  }
}
