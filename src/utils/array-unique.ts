type CompareHandler<T> = (a: T, b: T) => boolean;

/**
 * @example
 * arrayUnique([1, 2, 1, 3, 2, 3, 1])
 *  // [1, 2, 3]
 */
export function arrayUnique<T>(arr: T[], compareHandler: CompareHandler<T> = (a, b) => a === b) {
  const result: T[] = [];

  for (const item of arr) {
    if (!result.some((resItem) => compareHandler(item, resItem))) {
      result.push(item);
    }
  }

  return result;
}
