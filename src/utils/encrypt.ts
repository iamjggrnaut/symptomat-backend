import crypto from 'crypto';

const iv = crypto.randomBytes(16);

interface EncryptData {
  iv: string;
  encryptedData: string;
}

export const encrypt = (text: string, key: string): EncryptData => {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
};
