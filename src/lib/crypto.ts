import CryptoJS from 'crypto-js';

export function generateAESKey(): string {
  return CryptoJS.lib.WordArray.random(256 / 8).toString();
}

export function encryptData(data: string, key: string): string {
  return CryptoJS.AES.encrypt(data, key).toString();
}

export function decryptData(encryptedData: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function hashData(data: string): string {
  return CryptoJS.SHA256(data).toString();
}

export function encryptKeyForRecipient(aesKey: string, recipientPublicKey: string): string {
  return CryptoJS.AES.encrypt(aesKey, recipientPublicKey).toString();
}

export function decryptKeyWithPrivateKey(encryptedKey: string, privateKey: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedKey, privateKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
