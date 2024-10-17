export type MaybePromise<T> = T | Promise<T>;

export type MaybeReadonly<T> = T | Readonly<T>;

/**
 * An absent or uninitialized value that can represent `null` even with
 * [`strictNullChecks`](https://www.typescriptlang.org/tsconfig/#strictNullChecks)
 * on.
 */
export type Nothing = undefined | null;

/**
 * Convert an intersection of objects to a single object, making the type easier
 * to read.
 *
 * @example
 * ```ts
 * type Intersection = { a: number } & { b: string };
 * type Prettified = Prettify<Intersection>;
 * // { a: number; b: string }
 * ```
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & unknown;

/**
 * Convert members of a union to an intersection.
 *
 * @example
 * ```ts
 * type Union = { a: number } | { b: string };
 * type Intersection = UnionToIntersection<Union>;
 * // { a: number } & { b: string }
 * ```
 */
type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (
  x: infer R,
) => any
  ? R
  : never;

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
export type MergeKeys<T> = UnionToIntersection<T> extends infer I
  ? {
      [K in keyof I]: K extends keyof T ? T[K] : I[K];
    }
  : never;
