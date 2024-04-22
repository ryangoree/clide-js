export type MaybePromise<T> = T | Promise<T>;

export type MaybeReadonly<T> = T | Readonly<T>;

export type Prettify<T> = { [K in keyof T]: T[K] } & unknown;

type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (
  x: infer R,
) => any
  ? R
  : 'end never';

/**
 * Merge the keys of a union or intersection of objects into a single type.
 *
 * @example
 * ```ts
 * type A = { a: number; common: string };
 * type B = { b: string; common: number };
 *
 * type Merged = MergeKeys<A | B>;
 * // {
 * //   a: number;
 * //   b: string;
 * //   common: string | number;
 * // }
 * ```
 */
export type MergeKeys<T> =
  UnionToIntersection<T> extends infer I
    ? {
        [K in keyof I]: K extends keyof T ? T[K] : I[K];
      }
    : never;
