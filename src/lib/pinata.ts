import { PINATA_JWT, PINATA_GATEWAY } from './constants';

export async function uploadToIPFS(data: object): Promise<string> {
  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify({
      pinataContent: data,
      pinataMetadata: {
        name: `diploma-${Date.now()}`,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to upload to IPFS: ${error}`);
  }

  const result = await response.json();
  return result.IpfsHash;
}

export async function uploadFileToIPFS(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append(
    'pinataMetadata',
    JSON.stringify({ name: `file-${Date.now()}` })
  );

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to upload file to IPFS: ${error}`);
  }

  const result = await response.json();
  return result.IpfsHash;
}

export async function fetchFromIPFS(cid: string): Promise<unknown> {
  const response = await fetch(`${PINATA_GATEWAY}/${cid}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
  }
  return response.json();
}

export function getIPFSUrl(cid: string): string {
  return `${PINATA_GATEWAY}/${cid}`;
}
