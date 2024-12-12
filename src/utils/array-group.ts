type IsInGroupe<T> = (a: T, b: T) => boolean;

/**
 * @example
 * arrayGroup(
 *   [{x: 1}, {x: 3}, {x: 2}, {x: 1}, {x: 2}, {x: 4}, {x: 2}, {x: 3}],
 *   (a, b) => a.x === b.x,
 * ) // [
 *   //   [{x:3},{x:3}],
 *   //   [{x:2},{x:2},{x:2}],
 *   //   [{x:4}],[{x:1},{x:1}]
 *   // ]
 */
function arrayGroup<T>(arr: T[], isInGroupe?: IsInGroupe<T>): T[][];
/**
 * @example
 * arrayGroup(
 *   [{x: 1}, {x: 3}, {x: 2}, {x: 1}, {x: 2}, {x: 4}, {x: 2}, {x: 3}],
 *   'x',
 * ) // [
 *   //   [{x:3},{x:3}],
 *   //   [{x:2},{x:2},{x:2}],
 *   //   [{x:4}],[{x:1},{x:1}]
 *   // ]
 */
function arrayGroup<T, Prop extends keyof T>(arr: T[], prop?: Prop): T[][];
/**
 * @example
 * arrayGroup([1, 3, 2, 1, 2, 4, 2, 3])
 *  // [[3,3],[2,2,2],[4],[1,1]]
 */
function arrayGroup<T, Prop extends keyof T>(arr: T[], isInGroupeOrProp: Prop | IsInGroupe<T> = (a, b) => a === b) {
  let isInGroupe: IsInGroupe<T>;

  if (typeof isInGroupeOrProp !== 'function') {
    const prop = isInGroupeOrProp;
    isInGroupe = (a, b) => a[prop] === b[prop];
  } else {
    isInGroupe = isInGroupeOrProp;
  }

  const result: T[][] = [];
  let inArr = [...arr];

  while (inArr.length) {
    const groupEl = inArr.pop();
    const group = [groupEl];

    inArr = inArr.filter((el) => {
      if (isInGroupe(el, groupEl)) {
        group.push(el);
        return false;
      }
      return true;
    });

    result.push(group);
  }

  return result;
}

export { arrayGroup };
