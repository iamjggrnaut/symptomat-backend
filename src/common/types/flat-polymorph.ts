import { MapToType } from './map-to-type';
import { UnionToIntersection } from './union-to-intersection';

/**
 * @example
 * type T = {
 *  x: number;
 * } | {
 *  y: number;
 * };
 * type FlatT = FlatPolymorph<T>;
 *  // { x?: number; y?: number; }
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type FlatPolymorph<Polymorph extends object> = MapToType<UnionToIntersection<Partial<Polymorph>>>;

/**
 * @example
 * type T = {
 *  type: 'x-point';
 *  x: number;
 * } | {
 *  type: 'y-point';
 *  y: number;
 * };
 * type FlatT = FlatTypedPolymorph<T>;
 *  // { x?: number; y?: number; type: "x-point" | "y-point"; }
 */
export type FlatTypedPolymorph<Polymorph extends { type: any }> = MapToType<Omit<FlatPolymorph<Polymorph>, 'type'>> & {
  type: Polymorph['type'];
};
