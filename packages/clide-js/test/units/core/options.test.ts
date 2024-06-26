import { createOptionsGetter } from 'src/core/options/options-getter';
import { describe, expect, it } from 'vitest';

describe('options', () => {
  describe('getter factory', () => {
    it('includes getter functions for each option in config', async () => {
      const getter = createOptionsGetter({
        optionsConfig: {
          foo: {
            type: 'string',
            alias: ['f'],
          },
          'foo-bar': {
            type: 'string',
          },
        },
        optionValues: {
          foo: 'bar',
          'foo-bar': 'bar-baz',
        },
      });

      expect(await getter.f()).toBe('bar');
      expect(await getter.foo()).toBe('bar');
      expect(await getter.fooBar()).toBe('bar-baz');
      expect(await getter['foo-bar']()).toBe('bar-baz');
    });

    it('includes "get" function to get multiple options by name', async () => {
      const getter = createOptionsGetter({
        optionsConfig: {
          foo: {
            type: 'string',
            alias: ['f'],
          },
          'foo-bar': {
            type: 'string',
          },
        },
        optionValues: {
          foo: 'bar',
          'foo-bar': 'bar-baz',
        },
      });

      expect(await getter.get(['foo', 'f', 'foo-bar'])).toEqual({
        foo: 'bar',
        f: 'bar',
        'foo-bar': 'bar-baz',
        fooBar: 'bar-baz',
      });
    });

    it('includes "values" object with all option values', async () => {
      const getter = createOptionsGetter({
        optionsConfig: {
          foo: {
            type: 'string',
            alias: ['f'],
          },
          'foo-bar': {
            type: 'string',
          },
        },
        optionValues: {
          foo: 'bar',
          'foo-bar': 'bar-baz',
        },
      });

      expect(await getter.values).toEqual({
        f: 'bar',
        foo: 'bar',
        'foo-bar': 'bar-baz',
        fooBar: 'bar-baz',
      });
    });
  });

  // describe('aliased getter factory', () => {
  //   it('includes functions for each option and alias', async () => {
  //     const getter = aliasedOptionsGetter({
  //       options: {
  //         f: {
  //           type: 'string',
  //           alias: ['foo'],
  //         },
  //         'foo-bar': {
  //           type: 'string',
  //           alias: ['foo-bar-alias'],
  //         },
  //       },
  //       originalGetter: createOptionsGetter({
  //         foo: 'bar',
  //         'foo-bar': 'bar-baz',
  //       }),
  //       client: context.client,
  //     });
  //     expect(await getter.f()).toBe('bar');
  //     expect(await getter.foo()).toBe('bar');
  //     expect(await getter.fooBar()).toBe('bar-baz');
  //     expect(await getter.fooBarAlias()).toBe('bar-baz');
  //     expect(await getter['foo-bar']()).toBe('bar-baz');
  //     expect(await getter['foo-bar-alias']()).toBe('bar-baz');
  //   });
  //   it('includes "get" function to get multiple options by name or alias', async () => {
  //     const getter = aliasedOptionsGetter({
  //       options: {
  //         f: {
  //           type: 'string',
  //           alias: ['foo'],
  //         },
  //         'foo-bar': {
  //           type: 'string',
  //           alias: ['foo-bar-alias'],
  //         },
  //       },
  //       originalGetter: createOptionsGetter({
  //         foo: 'bar',
  //         'foo-bar': 'bar-baz',
  //       }),
  //       client: context.client,
  //     });
  //     expect(
  //       await getter.get(['f', 'foo', 'foo-bar', 'foo-bar-alias']),
  //     ).toEqual({
  //       f: 'bar',
  //       foo: 'bar',
  //       'foo-bar': 'bar-baz',
  //       fooBar: 'bar-baz',
  //       'foo-bar-alias': 'bar-baz',
  //       fooBarAlias: 'bar-baz',
  //     });
  //   });
  //   it('includes "values" object with all option and alias values', async () => {
  //     const getter = aliasedOptionsGetter({
  //       options: {
  //         f: {
  //           type: 'string',
  //           alias: ['foo'],
  //         },
  //         'foo-bar': {
  //           type: 'string',
  //           alias: ['foo-bar-alias'],
  //         },
  //       },
  //       originalGetter: createOptionsGetter({
  //         foo: 'bar',
  //         'foo-bar': 'bar-baz',
  //       }),
  //       client: context.client,
  //     });
  //     expect(await getter.values).toEqual({
  //       f: 'bar',
  //       foo: 'bar',
  //       'foo-bar': 'bar-baz',
  //       fooBar: 'bar-baz',
  //       'foo-bar-alias': 'bar-baz',
  //       fooBarAlias: 'bar-baz',
  //     });
  //   });
  //   it('includes functions for each option and alias from config', async () => {
  //     const getter = aliasedOptionsGetter({
  //       options: {
  //         f: {
  //           type: 'string',
  //           alias: ['foo'],
  //         },
  //         'foo-bar': {
  //           type: 'string',
  //           alias: ['foo-bar-alias'],
  //         },
  //       },
  //       originalGetter: createOptionsGetter({}),
  //       client: context.client,
  //     });
  //     expect(getter).toMatchObject({
  //       f: expect.any(Function),
  //       foo: expect.any(Function),
  //       fooBar: expect.any(Function),
  //       fooBarAlias: expect.any(Function),
  //       'foo-bar': expect.any(Function),
  //       'foo-bar-alias': expect.any(Function),
  //     });
  //   });
  // });
  // describe('config validator', () => {
  //   it('throws OptionsConfigError on invalid options config', async () => {
  //     expect(() => {
  //       validateOptionsConfig({
  //         a: {
  //           type: 'string',
  //           required: true,
  //           conflicts: ['b'], // <-- can't be required and have conflicts
  //         },
  //         b: {
  //           type: 'string',
  //         },
  //       });
  //     }).toThrowError(OptionsConfigError);
  //     expect(() => {
  //       validateOptionsConfig({
  //         a: {
  //           type: 'string',
  //           required: true,
  //           requires: ['b'], // <-- can't be required and have requires
  //         },
  //         b: {
  //           type: 'string',
  //         },
  //       });
  //     }).toThrowError(OptionsConfigError);
  //   });
  // });
  // describe('validator', () => {
  //   it('throws OptionsError on invalid option types', async () => {
  //     expect(() => {
  //       validateOptions(
  //         {
  //           foo: {
  //             type: 'string', // <-- string
  //           },
  //         },
  //         {
  //           foo: 123, // <-- but is a number
  //         },
  //       );
  //     }).toThrowError(OptionsError);
  //     expect(() => {
  //       validateOptions(
  //         {
  //           foo: {
  //             type: 'number', // <-- number
  //           },
  //         },
  //         {
  //           foo: 'bar', // <-- but is a string
  //         },
  //       );
  //     }).toThrowError(OptionsError);
  //     expect(() => {
  //       validateOptions(
  //         {
  //           foo: {
  //             type: 'boolean', // <-- boolean
  //           },
  //         },
  //         {
  //           foo: 'bar', // <-- but is a string
  //         },
  //       );
  //     }).toThrowError(OptionsError);
  //     expect(() => {
  //       validateOptions(
  //         {
  //           foo: {
  //             type: 'array', // <-- array of strings
  //           },
  //         },
  //         {
  //           foo: 'bar', // <-- but is a string
  //         },
  //       );
  //     }).toThrowError(OptionsError);
  //   });
  //   it('throws OptionsError on missing required options', async () => {
  //     expect(() => {
  //       validateOptions(
  //         {
  //           foo: {
  //             type: 'string',
  //             required: true, // <-- required
  //           },
  //         },
  //         {}, // <-- but missing
  //       );
  //     }).toThrowError(OptionsError);
  //   });
  //   it('throws OptionsError on conflicts', async () => {
  //     expect(() => {
  //       validateOptions(
  //         {
  //           a: {
  //             type: 'string',
  //             conflicts: ['b'], // <-- conflicts with b
  //           },
  //           bar: {
  //             type: 'string',
  //             alias: ['b'],
  //           },
  //         },
  //         {
  //           a: 'foo',
  //           b: 'bar', // <-- but b is present
  //         },
  //       );
  //     }).toThrowError(OptionsError);
  //     expect(() => {
  //       validateOptions(
  //         {
  //           a: {
  //             type: 'string',
  //             conflicts: ['b'], // <-- conflicts with b
  //           },
  //           bar: {
  //             type: 'string',
  //             alias: ['b'], // <-- includes alias b
  //           },
  //         },
  //         {
  //           a: 'foo',
  //           bar: 'bar', // <-- bar (aka, b) is present
  //         },
  //       );
  //     }).toThrowError(OptionsError);
  //   });
  //   it('throws OptionsError on missing required option combos', async () => {
  //     expect(() => {
  //       validateOptions(
  //         {
  //           a: {
  //             type: 'string',
  //             requires: ['b'], // <-- requires b
  //           },
  //         },
  //         {
  //           a: 'foo', // <-- but b is missing
  //         },
  //       );
  //     }).toThrowError(OptionsError);
  //   });
  // });
});
