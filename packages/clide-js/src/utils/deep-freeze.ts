type Clonable = Record<string | number | symbol, any>;

/**
 * Freezes an object and all of its properties recursively in place.
 * @ignore
 */
export function deepFreeze<TObject extends Clonable>(
  obj: TObject,
): DeepReadonly<TObject> {
  Object.freeze(obj);

  for (const key of Object.getOwnPropertyNames(obj)) {
    const value = obj[key];
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  }

  return obj as DeepReadonly<TObject>;
}

/**
 * Creates a deep clone of an object and freezes it and all of its properties.
 * @ignore
 */
export function deepFreezeClone<TObject extends Clonable>(
  obj: TObject,
): DeepReadonly<TObject> {
  const prototype = Object.getPrototypeOf(obj);
  const clone = Object.create(prototype);
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'object') {
      clone[key as keyof TObject] = deepFreezeClone(value) as typeof value;
    } else {
      clone[key as keyof TObject] = value;
    }
  }
  return Object.freeze(clone);
}

/**
 * A type that makes all properties of an object readonly recursively.
 * @ignore
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Function | Date | RegExp
    ? T[P]
    : T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};