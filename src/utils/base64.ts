export const encode = <T>(obj: T) => {
  const json = JSON.stringify(obj);
  return Buffer.from(json).toString('base64');
};

export const decode = <T>(base64: string): T | null => {
  const json = Buffer.from(base64, 'base64').toString('ascii');
  try {
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
};

export const cursorToData = <T>(after: string): T => {
  const cursor = decode<T>(after);
  if (!cursor) throw new Error('Invalid cursor!');
  return cursor;
};

export const dataToCursor = <T>(cursor: T): string => {
  return encode(cursor);
};
