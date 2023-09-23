export function deepFreezeClone<
  TObject extends Record<string | number | symbol, any>,
>(obj: TObject): Readonly<TObject> {
  if (
    obj instanceof Date ||
    obj instanceof RegExp ||
    Object.getPrototypeOf(obj) !== Object.prototype
  ) {
    return obj;
  }

  const clone = { ...obj };

  for (const key of Object.getOwnPropertyNames(clone)) {
    const value = clone[key];
    if (value && typeof value === 'object') {
      clone[key as keyof TObject] = deepFreezeClone(value) as typeof value;
    }
  }
  return Object.freeze(clone);
}
