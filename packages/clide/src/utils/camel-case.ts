/**
 * Converts a hyphenated string to camel case.
 *
 * @example
 * camelCase('foo-bar') // 'fooBar'
 */
export function camelCase<S>(str: S): CamelCase<S> {
  const result = (
    typeof str !== 'string'
      ? str
      : str.toLowerCase().replace(/-+([^-])/g, (_, c) => c.toUpperCase())
  ) as CamelCase<S>;
  return result;
}

export type CamelCase<S> = S extends `${infer T}-${infer U}`
  ? `${Lowercase<T>}${Capitalize<CamelCase<U>>}`
  : S extends string
  ? Lowercase<S>
  : S;
