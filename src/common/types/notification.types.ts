export type RedisHashFromLinkRecord = {
  hash: string;
  expDate: string;
  senderUserId: string;
};

export const CODE_LENGTH = 6;
export const PASSWORD_LENGTH = 10;
export const CODE_EXPIRES_IN_SECONDS = 300;

export enum RedisHashFromLinkKey {
  CHANGE_EMAIL_KEY = '-ce',
  EMAIL_RECOVERY_PASSWORD_KEY = '-erp',
}

export class RedisPayload {
  hash: string;
  email: string;
  senderUserId: string;
}

export type RedisRecoveryHashFromLinkRecord = {
  hash: string;
  expDate: string;
  email: string;
};
