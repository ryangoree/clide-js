import initCliui from 'cliui';
import { ClideClient, PromptOptions } from './client';
import { UsageError } from './errors';
import { CamelCase, camelCase } from './utils/camel-case';
import { deepFreezeClone } from './utils/deep-freeze-clone';
import { Options } from './parse';
import { MaybePromise } from './utils/types';

const cliui = initCliui({
  width: 80,
  wrap: true,
});

/**
 * Converts command options to a getter object.
 *
 * This function transforms an `Options` object into a
 * `ClideCommandOptionsGetter` object that has getter methods for each of the
 * options. The getters can then be used to retrieve the values of the options
 * dynamically.
 *
 * Additionally, the returned object has a `get` method, which accepts an array
 * of option keys and returns an object with the corresponding camelCased
 * key-value pairs.
 *
 * @param options - The options to be converted.
 *
 * @returns The getter object for the provided options.
 *
 * @example
 * const options = { 'first-name': 'Max' };
 * const getter = optionsGetter(options);
 * const firstName = getter.firstName(); // 'Max'
 */
export function optionsGetter(options: Options): ClideCommandOptionsGetter {
  return {
    ...Object.fromEntries(
      Object.entries(options).map(([key, value]) => [
        camelCase(key),
        () => value,
      ]),
    ),
    get: function (keys: string[]) {
      return Object.fromEntries(
        keys.map((key) => [camelCase(key), (this as any)[camelCase(key)]?.()]),
      );
    },
    options: deepFreezeClone(
      Object.fromEntries(
        Object.entries(options).map(([key, value]) => [camelCase(key), value]),
      ),
    ),
  } as ClideCommandOptionsGetter;
}

interface AliasedOptionsGetterFactoryOptions<
  TOptions extends ClideCommandOptions,
> {
  /**
   * The options to be aliased.
   */
  options: TOptions;
  /**
   * The original getter to be extended.
   */
  originalGetter: ClideCommandOptionsGetter<TOptions>;
  /**
   * The client to use for prompting.
   */
  client: ClideClient;
}

/**
 * An object that can be used to get the values of a command's options.
 */
export type ClideCommandOptionsGetter<
  TOptions extends ClideCommandOptions = ClideCommandOptions,
> = {
  get: <K extends keyof TOptions | Alias<TOptions[keyof TOptions]>>(
    optionNames: K[],
  ) => {
    [K2 in K as CamelCase<K2>]: CommandOptionsTypes<TOptions>[K2];
  };
  /**
   * The original options object with camelCased keys.
   */
  readonly options: Readonly<{
    [K in keyof TOptions as CamelCase<K>]: TOptions[K];
  }>;
} & {
  [K in keyof TOptions as CamelCase<K>]: OptionGetter<
    CommandOptionType<TOptions[K]>
  >;
} & {
  [K in keyof TOptions as CamelCase<Alias<TOptions[K]>>]: OptionGetter<
    CommandOptionType<TOptions[K]>
  >;
};

/**
 * Extends the options getter to support option aliases.
 *
 * This function builds upon the base `optionsGetter` to incorporate aliases for
 * each option. If an option has defined aliases, the returned getter will have
 * additional getter methods for each alias, all pointing to the original
 * option's value.
 *
 * The function iterates over the options, and for each option, it checks for
 * existing getter methods (either from the original or its aliases). If a
 * getter is found, it's used; otherwise, a default value or the option's
 * defined default is utilized.
 *
 * @param options - The options with potential aliases.
 * @param originalGetter - The original getter to be extended. Defaults to an
 * empty getter.
 *
 * @returns The extended getter object supporting option aliases.
 *
 * @example
 * const options = {
 *   f: {
 *     type: 'string',
 *     alias: ['foo'],
 *     default: 'default foo'
 *   },
 * };
 * const aliasedGetter = aliasedOptionsGetter({
 *   options,
 *   originalGetter: optionsGetter({}),
 *   client: new ClideClient(),
 * });
 * const val = aliasedGetter.foo(); // 'default foo'
 */
// TODO: Cache the result of this function
export function aliasedOptionsGetter<TOptions extends ClideCommandOptions>({
  options,
  originalGetter = optionsGetter({}) as ClideCommandOptionsGetter<TOptions>,
  client,
}: AliasedOptionsGetterFactoryOptions<TOptions>): ClideCommandOptionsGetter<TOptions> {
  validateOptions(options, originalGetter);

  const aliasedOptionsGetter: ClideCommandOptionsGetter<TOptions> = {
    ...originalGetter,
  };

  type GetterKey = keyof typeof aliasedOptionsGetter;

  for (const key in options) {
    const option = options[key];
    const keys = [key, ...(option.alias || [])];
    let foundKey: keyof typeof originalGetter.options | undefined;

    for (const key of keys) {
      const camelCasedKey = camelCase(key);
      if (camelCasedKey in aliasedOptionsGetter.options) {
        foundKey = camelCasedKey;
        break;
      }
    }

    for (const key of keys) {
      aliasedOptionsGetter[key as GetterKey] = optionGetter({
        client,
        name: key,
        option,
        value: foundKey ? aliasedOptionsGetter.options[foundKey] : undefined,
      }) as any;
    }
  }

  return aliasedOptionsGetter as ClideCommandOptionsGetter<TOptions>;
}

/**
 * Validates the options for a command by checking for required options,
 * conflicts, and dependencies.
 *
 * @param options - The options to be validated.
 *
 * @throws {OptionsError} Throws an error if the options are invalid.
 */
export function validateOptions(
  options: ClideCommandOptions,
  getter: ClideCommandOptionsGetter,
) {
  const parsedNames = Object.keys(getter.options).filter(
    (key) => key !== 'get',
  );

  for (const name of parsedNames) {
    const option = options[name];

    if (!option) continue;

    const required = option.required || false;
    const conflicts = option.conflicts || [];
    const requires = option.requires || [];

    if (required && conflicts.length) {
      throw new OptionsError(
        `Option "${name}" cannot be required and conflict with other options`,
      );
    }

    if (required && requires.length) {
      throw new OptionsError(
        `Option "${name}" cannot be required and require other options`,
      );
    }

    for (const conflict of conflicts) {
      if (parsedNames.includes(conflict)) {
        throw new OptionsError(
          `Option "${name}" conflicts with option "${conflict}"`,
        );
      }
    }

    for (const required of requires) {
      if (!parsedNames.includes(required)) {
        throw new OptionsError(
          `Option "${name}" requires option "${required}"`,
        );
      }
    }
  }
}

export class OptionsError extends UsageError {
  constructor(message: string) {
    super(message);
    this.name = 'OptionsError';
  }
}

interface OptionGetterFactoryOptions<
  TOption extends ClideCommandOption = ClideCommandOption,
  TValue = unknown,
> {
  /**
   * The name of the option.
   */
  name: string;
  /**
   * The option to create a getter for.
   */
  option: TOption;
  /**
   * The value of the option.
   */
  value: TValue;
  /**
   * The client to use for prompting.
   */
  client: ClideClient;
}

/**
 * Creates a getter for a command option.
 *
 * This function creates an `OptionGetter` function to dynamically retrieve the
 * value of a command option. The getter function accepts an optional
 * `GetValueOptions` object, which can be used to prompt the user when no value
 * is provided and/or validate the value.
 *
 * @param getOptions - The options to create the getter.
 *
 * @returns The getter function for the provided option.
 *
 * @example
 * const fooGetter = optionGetter({
 *   name: 'foo',
 *   option: {
 *     type: 'string',
 *     default: 'default foo',
 *   },
 *   value: 'foo value',
 *   client: new ClideClient(),
 * });
 * const val = fooGetter({ prompt: { message: 'Enter foo' } }); // 'foo value'
 *
 * @throws {UsageError} Throws an error if the option is required and no value
 * is provided or the value is invalid.
 */
export function optionGetter<
  TOption extends ClideCommandOption = ClideCommandOption,
  TValue = unknown,
>({
  name,
  option,
  value,
  client,
}: OptionGetterFactoryOptions<TOption, TValue>): OptionGetter<TValue> {
  let cachedValue: TValue | undefined;

  return async ({ prompt, validate }: GetValueOptions = {}) => {
    if (cachedValue !== undefined) {
      return cachedValue;
    }

    let type: PromptOptions['type'] = 'text';

    switch (option.type) {
      case 'number':
        type = 'number';
        break;
      case 'boolean':
        type = 'toggle';
        break;
      case 'array':
        type = 'list';
        break;
    }

    if (value === undefined) {
      if (prompt) {
        value = await client.prompt({
          ...(typeof prompt === 'string' ? { message: prompt } : prompt),
          initial: option.default?.toString(),
          name,
          type,
          validate:
            validate || option.required
              ? (value) => defaultValidate(value, option.type)
              : undefined,
        });
      } else {
        value = option.default as TValue;
      }
    }

    if (value === undefined && option.required) {
      throw new UsageError(`Option "${name}" is required`);
    }

    if (validate || option.required) {
      const valid = await (validate || defaultValidate)(value);
      if (!valid) {
        cliui.div({
          text: `Expected: ${option.type}`,
          padding: [2, 0, 0, 2],
        });
        cliui.div({
          text: `Received: ${value}`,
          padding: [0, 0, 1, 2],
        });
        throw new UsageError(
          `Invalid value for option "${name}"${cliui.toString()}`,
        );
      }
    }

    cachedValue = value;
    return value;
  };
}

export type ClideOptionType = 'string' | 'number' | 'boolean' | 'array';

export interface ClideCommandOption<
  T extends ClideOptionType = ClideOptionType,
  TAlias extends string = string,
> {
  /**
   * One or more aliases for the option (optional).
   */
  alias?: TAlias[];
  /**
   * The type of the option (optional, has default based on `default`).
   */
  type: T;
  /**
   * The description of the option (optional, has default based on `name`).
   */
  description?: string;
  /**
   * The prompt to show the user if no value is provided (optional).
   */
  prompt?: string | PromptOptions;
  /**
   * The default value to use the prompt will show (optional).
   */
  default?: OptionPrimitiveType<T>;
  /**
   * Prompts the user for the option if it's not present and requires the
   * user enters a valid value. If no `prompt` field is provided, a default
   * will be used based on `name`.
   */
  required?: boolean;
  /**
   * Other options that are required for this option to be used (optional).
   */
  requires?: string[];
  /**
   * Other options that are mutually exclusive with this option (optional).
   */
  conflicts?: string[];

  /**
   * The autocomplete function (optional).
   */
  autoComplete?: (input: string) => MaybePromise<string[]>;
  // autoComplete: [
  //   // potential values, engine will manage matching
  // ]
}

export type ClideCommandOptions<
  TKey extends string = string,
  TType extends ClideOptionType = ClideOptionType,
> = Record<TKey, ClideCommandOption<TType, TKey>>;

function defaultValidate(value: unknown, optionType?: ClideOptionType) {
  switch (optionType) {
    case 'number':
      return typeof value === 'number';

    case 'boolean':
      return typeof value === 'boolean';

    case 'array':
      let _value = value;
      if (typeof _value === 'string') {
        _value = _value.split(',');
      }
      return Array.isArray(_value) && _value.length > 0;

    case 'string':
    default:
      return typeof value === 'string' && value.length > 0;
  }
}

interface GetValueOptions {
  /**
   * The prompt to show the user if no value is provided (optional).
   */
  prompt?: string | Omit<PromptOptions, 'type' | 'name' | 'validate'>;
  /**
   * The validation function (optional).
   */
  validate?: (value: unknown) => MaybePromise<boolean>;
}

type OptionGetter<T> = (getterOptions?: GetValueOptions) => MaybePromise<T>;
// export type OptionGetter<T> = () => MaybePromise<T>;

type Alias<T extends ClideCommandOption> = T extends { alias: string[] }
  ? T['alias'][number]
  : never;

type OptionPrimitiveType<T extends ClideOptionType> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'boolean'
  ? boolean
  : T extends 'array'
  ? string[]
  : never;

type CommandOptionType<T extends ClideCommandOption> =
  T['required'] extends true
    ? OptionPrimitiveType<T['type']>
    : T['default'] extends OptionPrimitiveType<T['type']>
    ? OptionPrimitiveType<T['type']>
    : OptionPrimitiveType<T['type']> | undefined;

type CommandOptionsTypes<T extends ClideCommandOptions> = {
  [K in keyof T]: CommandOptionType<T[K]>;
} & {
  [K in keyof T as Alias<T[K]>]: CommandOptionType<T[K]>;
};
