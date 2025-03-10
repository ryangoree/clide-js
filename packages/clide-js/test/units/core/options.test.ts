import { createOptionsGetter } from 'src/core/options/options-getter';
import {
  OptionsConfigError,
  validateOptionsConfig,
} from 'src/core/options/validate-option-config';
import {
  OptionsError,
  validateOptions,
} from 'src/core/options/validate-options';
import { describe, expect, it } from 'vitest';

describe('options', () => {
  describe('createOptionsGetter', () => {
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

      expect(await getter.get('foo', 'f', 'foo-bar')).toEqual({
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

  describe('validateOptionsConfig', () => {
    it('throws OptionsConfigError on invalid options config', async () => {
      expect(() => {
        validateOptionsConfig({
          a: {
            type: 'string',
            required: true,
            conflicts: ['b'], // <-- can't be required and have conflicts
          },
          b: {
            type: 'string',
          },
        });
      }).toThrowError(OptionsConfigError);

      expect(() => {
        validateOptionsConfig({
          a: {
            type: 'string',
            required: true,
            requires: ['b'], // <-- can't be required and have requires
          },
          b: {
            type: 'string',
          },
        });
      }).toThrowError(OptionsConfigError);
    });
  });

  describe('validator', () => {
    it('throws OptionsError on invalid option types', async () => {
      expect(() => {
        validateOptions({
          values: {
            foo: 123, // <-- number
          },
          config: {
            foo: {
              type: 'string', // <-- should be a string
            },
          },
          validations: {
            type: true,
          },
        });
      }).toThrowError(OptionsError);

      expect(() => {
        validateOptions({
          values: {
            foo: 'bar', // <-- string
          },
          config: {
            foo: {
              type: 'number', // <-- should be a number
            },
          },
          validations: {
            type: true,
          },
        });
      }).toThrowError(OptionsError);

      expect(() => {
        validateOptions({
          values: {
            foo: 'bar', // <-- string
          },
          config: {
            foo: {
              type: 'boolean', // <-- should be a boolean
            },
          },
          validations: {
            type: true,
          },
        });
      }).toThrowError(OptionsError);

      expect(() => {
        validateOptions({
          values: {
            foo: 'bar', // <-- string
          },
          config: {
            foo: {
              type: 'array', // <-- should be an array of strings
            },
          },
          validations: {
            type: true,
          },
        });
      }).toThrowError(OptionsError);
    });

    it('throws OptionsError on missing required options', async () => {
      expect(() => {
        validateOptions({
          values: {}, // <-- no values
          config: {
            foo: {
              type: 'string',
              required: true, // <-- required value
            },
          },
          validations: {
            required: true,
          },
        });
      }).toThrowError(OptionsError);
    });

    it('throws OptionsError on conflicts', async () => {
      expect(() => {
        validateOptions({
          values: {
            a: 'foo',
            b: 'bar', // <-- b is present
          },
          config: {
            a: {
              type: 'string',
              conflicts: ['b'], // <-- conflicts with b
            },
            b: {
              type: 'string',
            },
          },
          validations: {
            conflicts: true,
          },
        });
      }).toThrowError(OptionsError);

      expect(() => {
        validateOptions({
          values: {
            a: 'foo',
            B: 'bar', // <-- B (b's alias) is present
          },
          config: {
            a: {
              type: 'string',
              conflicts: ['b'], // <-- conflicts with b
            },
            b: {
              type: 'string',
              alias: ['B'],
            },
          },
          validations: {
            conflicts: true,
          },
        });
      }).toThrowError(OptionsError);

      expect(() => {
        validateOptions({
          values: {
            a: 'foo',
            b: 'bar', // <-- b is present
          },
          config: {
            a: {
              type: 'string',
              conflicts: ['B'], // <-- conflicts with b's alias
            },
            b: {
              type: 'string',
              alias: ['B'],
            },
          },
          validations: {
            conflicts: true,
          },
        });
      }).toThrowError(OptionsError);
    });

    it('throws OptionsError on missing required option combos', async () => {
      expect(() => {
        validateOptions({
          values: {
            a: 'foo', // <-- b is missing
          },
          config: {
            a: {
              type: 'string',
              requires: ['b'], // <-- requires b
            },
            b: {
              type: 'string',
            },
          },
          validations: {
            requires: true,
          },
        });
      }).toThrowError(OptionsError);

      expect(() => {
        validateOptions({
          values: {
            a: 'foo', // <-- b is missing
          },
          config: {
            a: {
              type: 'string',
              requires: ['B'], // <-- requires b's alias
            },
            b: {
              type: 'string',
              alias: ['B'],
            },
          },
          validations: {
            requires: true,
          },
        });
      }).toThrowError(OptionsError);
    });
  });
});
