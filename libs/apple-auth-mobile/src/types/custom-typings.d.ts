/* eslint-disable */
declare module 'apple-signin-auth' {
  export interface AppleUser {
    sub: string;
    email?: string;
  }
  // @ts-ignore
  export const verifyIdToken = async (idToken: string, { nonce: string }): Promise<AppleUser> => {
    //
    return Promise.resolve({
      email: 'email',
      sub: 'sub',
    });
  };
}
