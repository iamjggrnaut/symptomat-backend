export type MapToType<T> =
  // eslint-disable-next-line @typescript-eslint/ban-types
  T extends object
    ? {
        [P in keyof T]: MapToType<T[P]>;
      }
    : T;
