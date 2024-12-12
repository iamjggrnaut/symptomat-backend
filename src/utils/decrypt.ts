import crypto from 'crypto';

export const decrypt = (textIV: string, encryptedData: string, key: string): string => {
  const iv = Buffer.from(textIV, 'hex');
  const encryptedText = Buffer.from(encryptedData, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};
