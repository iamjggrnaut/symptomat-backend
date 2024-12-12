export const generateVerificationCode = (length: number) => {
  if (isNaN(length)) {
    throw new Error('Length must be a number');
  }

  if (length < 1) {
    throw new Error('Length must be at least 1');
  }

  const possible = '123456789';
  let code = '';

  while (code.length !== length) {
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return code;
};

export const generatePassword = (length: number): string => {
  if (isNaN(length)) {
    throw new Error('Length must be a number');
  }

  if (length < 1) {
    throw new Error('Length must be at least 1');
  }
  return Math.random().toString(36).slice(-length);
};
