import { deepFreezeClone } from 'src/utils/deep-freeze';
import { describe, expect, it } from 'vitest';

describe('deep-freeze-clone', () => {
  it('deeply freezes an object', () => {
    const obj = {
      foo: {
        bar: {
          baz: 5,
        },
      },
    };

    const frozen = deepFreezeClone(obj);

    expect(Object.isFrozen(frozen)).toBe(true);

    expect(() => {
      (frozen.foo.bar.baz as any) = 6;
    }).toThrowError();
  });
});
