/* eslint-disable */
declare module 'fb' {
  export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  }
  // @ts-ignore
  export const api = async (
    resourse: string,
    {
      fields,
      access_token,
    }: {
      fields: string;
      access_token: string;
    },
  ): // @ts-ignore
  Promise<User> => {
    return {
      id: 'id',
      email: 'email',
      first_name: 'first_name',
      last_name: 'last_name',
    };
  };
}
