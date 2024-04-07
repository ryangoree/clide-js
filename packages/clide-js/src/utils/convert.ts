/**
 * Deeply converts values in an object or array or a single value.
 *
 * @param value - The value or object/array containing values to convert.
 * @param predicateFn - The predicate function to determine if a value should be
 * converted.
 * @param converterFn - The function to convert the value.
 *
 * @returns The converted value.
 * 
 * @internal
 */
export function convert<T, TOriginal, TNew>(
  value: T,
  predicateFn: (value: any) => value is TOriginal,
  converterFn: (value: TOriginal) => TNew,
): Converted<T, TOriginal, TNew> {
  // If the value itself should be converted, convert it
  if (predicateFn(value)) {
    return converterFn(value) as Converted<T, TOriginal, TNew>;
  }

  // If the value is an array, convert each item in the array
  if (Array.isArray(value)) {
    return value.map((item) =>
      convert(item, predicateFn, converterFn),
    ) as Converted<T, TOriginal, TNew>;
  }

  // If the value is an object, convert each value in the object
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, value]) => [
        key,
        convert(value, predicateFn, converterFn),
      ]),
    ) as Converted<T, TOriginal, TNew>;
  }

  return value as Converted<T, TOriginal, TNew>;
}

/** The type of a deeply converted value. */
export type Converted<T, TOriginal, TNew> = T extends TOriginal
  ? TNew
  : T extends Array<infer U>
  ? Converted<U, TOriginal, TNew>[]
  : T extends object
  ? { [K in keyof T]: Converted<T[K], TOriginal, TNew> }
  : T;
