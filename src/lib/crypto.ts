import CryptoJS from 'crypto-js';
import nacl from 'tweetnacl';
import { decodeUTF8, encodeUTF8, encodeBase64, decodeBase64 } from 'tweetnacl-util';

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

export function generateKeyPair(): { publicKey: string; secretKey: string } {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: encodeBase64(keyPair.publicKey),
    secretKey: encodeBase64(keyPair.secretKey),
  };
}

export function encryptKeyForRecipient(aesKey: string, recipientPublicKey: string, senderSecretKey: string): string {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const messageUint8 = decodeUTF8(aesKey);
  const recipientPubKeyUint8 = decodeBase64(recipientPublicKey);
  const senderSecKeyUint8 = decodeBase64(senderSecretKey);

  const encrypted = nacl.box(messageUint8, nonce, recipientPubKeyUint8, senderSecKeyUint8);
  if (!encrypted) throw new Error('Encryption failed');

  const fullMessage = new Uint8Array(nonce.length + encrypted.length);
  fullMessage.set(nonce);
  fullMessage.set(encrypted, nonce.length);

  return encodeBase64(fullMessage);
}

export function decryptKeyWithPrivateKey(encryptedKey: string, senderPublicKey: string, recipientSecretKey: string): string {
  const fullMessage = decodeBase64(encryptedKey);
  const nonce = fullMessage.slice(0, nacl.box.nonceLength);
  const message = fullMessage.slice(nacl.box.nonceLength);
  const senderPubKeyUint8 = decodeBase64(senderPublicKey);
  const recipientSecKeyUint8 = decodeBase64(recipientSecretKey);

  const decrypted = nacl.box.open(message, nonce, senderPubKeyUint8, recipientSecKeyUint8);
  if (!decrypted) throw new Error('Decryption failed');

  return encodeUTF8(decrypted);
}
