export type AnyObject<TValue = any> = Record<PropertyKey, TValue>;

export type AnyFunction = (...args: any) => any;

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
 * type Prettified = Eval<Intersection>;
 * // { a: number; b: string }
 * ```
 */
export type Eval<T> = { [K in keyof T]: T[K] } & unknown;

/**
 * Replace properties in `T` with properties in `U`.
 */
export type Replace<T, U> = Omit<T, keyof U> & U;

/**
 * Get a union of all property keys on `T` that are functions
 */
export type FunctionKey<T> = keyof {
  [K in keyof T as T[K] extends AnyFunction ? K : never]: K;
};

/**
 * Get a union of all keys from all members of `T`.
 *
 * @example
 * ```ts
 * type Foo = { a: string; b: number };
 * type Bar = { a: boolean; b: bigint; c: string };
 *
 * type FoobarKey = keyof (Foo | Bar);
 * // => "a" | "b" ❌ missing "c"
 *
 * type FoobarKey = keyof (Foo & Bar);
 * // => string | number | symbol ❌ intersecting incompatible types returns never
 *
 * type FoobarKey = UnionKey<Foo | Bar>;
 * // => "a" | "b" | "c" ✅
 * ```
 */
export type UnionKey<T> = T extends T ? keyof T : never;

/**
 * Get a union of all keys that are optional or missing in at least one member
 * of `T`.
 *
 * @example
 * ```ts
 * type Foo = { a: string; b?: number };
 * type Bar = { a: boolean; b: bigint; c: string };
 *
 * type OptionalFoobarKey = OptionalUnionKey<Foo | Bar>;
 * // => "b" | "c"
 * // "c" is included because it doesn't exist in Foo, therefore it's not guaranteed in the union
 * ```
 */
export type OptionalUnionKey<T> = keyof {
  [K in UnionKey<T> as T extends {
    [_ in K]: any;
  }
    ? never
    : K]: never;
};

/**
 * Get a union of all keys that are required in all members of `T`.
 *
 * @example
 * ```ts
 * type Foo = { a: string; b?: number };
 * type Bar = { a: boolean; b: bigint; c: string };
 *
 * type RequiredFoobarKey = RequiredUnionKey<Foo | Bar>;
 * // => "a"
 * ```
 */
export type RequiredUnionKey<T> = Exclude<UnionKey<T>, OptionalUnionKey<T>>;

/**
 * Get a union of all values for `K` from all members of `T`.
 *
 * @example
 * ```ts
 * type Foo = { a: string; b?: number };
 * type Bar = { a: boolean; b: bigint; c: string };
 *
 * type FooBar_A = UnionValue<Foo | Bar, "a">;
 * // => string | boolean
 *
 * type FooBar_B = UnionValue<Foo | Bar, "b">;
 * // => number | bigint | undefined
 *
 * type FooBar_C = UnionValue<Foo | Bar, "c">;
 * // => string | undefined
 * ```
 */
export type UnionValue<T, K extends UnionKey<T>> = T extends T
  ? K extends keyof T
    ? T[K]
    : undefined
  : never;

/**
 * Merge a union or intersection of objects into a single type.
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
export type Merge<T> = Eval<
  {
    [K in RequiredUnionKey<T>]: UnionValue<T, K>;
  } & {
    [K in OptionalUnionKey<T>]?: UnionValue<T, K>;
  }
>;
