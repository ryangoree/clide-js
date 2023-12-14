import { Client, PromptOptions } from 'src/core/client';
import { OptionsError, UsageError } from 'src/core/errors';
import { MaybePromise, MaybeReadonly } from 'src/utils/types';
import { OptionConfig, OptionPrimitiveType, OptionType } from './types';
import { validateOptionType } from './validate-options';

/**
 * A function to dynamically retrieve the value of a command option.
 * @group Options
 */
export type OptionGetter<T> = (
  getterOptions?: OptionGetterOptions,
) => Promise<T>;

interface OptionGetterFactoryOptions<
  TConfig extends OptionConfig = OptionConfig,
  TValue = MaybeReadonly<OptionPrimitiveType<TConfig['type']>> | undefined,
> {
  /**
   * The name of the option.
   */
  name: string;
  /**
   * The initial value of the option.
   */
  value: TValue;
  /**
   * The context of the command.
   */
  client: Client;
  /**
   * The option config.
   */
  config?: TConfig;
}

/**
 * Creates an `OptionGetter` function to dynamically retrieve the
 * value of a command option. The getter function accepts an optional
 * `OptionGetterOptions` object, which can be used to prompt the user when no value
 * is provided and/or validate the value.
 *
 * @param getOptions - The options to create the getter.
 *
 * @returns The getter function for the provided option.
 *
 * @example
 * const fooGetter = createOptionGetter({
 *   name: 'foo',
 *   option: {
 *     type: 'string',
 *     default: 'default foo',
 *   },
 *   value: 'foo value',
 *   client: new Client(),
 * });
 * const val = fooGetter({ prompt: { message: 'Enter foo' } }); // 'foo value'
 *
 * @throws {OptionsError} Throws an error if the option is required and no value
 * is provided or the value is invalid.
 * @group Options
 */
export function createOptionGetter<
  TConfig extends OptionConfig = OptionConfig,
  TValue = MaybeReadonly<OptionPrimitiveType<TConfig['type']>> | undefined,
>({
  name,
  config,
  value,
  client,
}: OptionGetterFactoryOptions<TConfig, TValue>): OptionGetter<TValue> {
  let cachedValue: TValue | undefined;

  return async ({ prompt, validate }: OptionGetterOptions = {}) => {
    // Avoid prompting for the same option multiple times
    if (cachedValue !== undefined) {
      return cachedValue;
    }

    let type: PromptOptions['type'];

    // Determine prompt type based on option type
    switch (config?.type) {
      case 'number':
        type = 'number';
        break;
      case 'boolean':
        type = 'toggle';
        break;
      case 'array':
        type = 'list';
      case 'string':
      default:
        type = 'text';
        break;
    }

    let validateFn = validate;

    // Use the default validate function if the option is required and no
    // validate function is provided
    if (config?.required && !validateFn) {
      validateFn = (value) => defaultValidate(value, config.type);
    }

    // Prompt for the option value if not provided and a prompt is provided
    if (value === undefined && prompt) {
      value = await client.prompt({
        ...(typeof prompt === 'string' ? { message: prompt } : prompt),
        // Use the default value for the initial prompt value
        initial: config?.default?.toString(),
        type,
        validate: validateFn,
      });
    }

    // If still no value, use the default
    if (value === undefined) {
      value = config?.default as TValue;
    }

    // If still no value, throw an error if the option is required
    if (value === undefined && config?.required) {
      throw new UsageError(`Option "${name}" is required`);
    }

    // Validate option value type
    if (config?.type) {
      validateOptionType(value, name, config.type);
    }

    // Validate the option value if a validate function is provided
    if (validateFn) {
      const valid = await validateFn(value);
      if (!valid) {
        throw new OptionsError(`Invalid value for option "${name}": ${value}`);
      }
    }

    // Cache the value and return it
    cachedValue = value;
    return value;
  };
}

/**
 * Configuration options for the {@linkcode OptionGetter} function.
 * @Group Options
 */
interface OptionGetterOptions {
  /**
   * The prompt to show the user if no value is provided (optional).
   */
  prompt?: string | PromptOptions;
  /**
   * The validation function (optional).
   */
  validate?: (value: unknown) => MaybePromise<boolean>;
}

/**
 * A minimal default validate function that validates the value based on the
 * option type. Used during prompting and before returning the value.
 * @param value - The value to validate.
 * @param optionType - The type of the option.
 * @returns `true` if the value is valid, otherwise `false`.
 * @remarks
 * This function doesn't throw an error if the value is invalid. It's meant to
 * be used during prompting and before returning the value.
 * @group Options
 */
function defaultValidate(value: unknown, optionType?: OptionType) {
  switch (optionType) {
    // Ensure numbers are numbers
    case 'number':
      return typeof value === 'number';

    // Ensure booleans are booleans
    case 'boolean':
      return typeof value === 'boolean';

    // Ensure arrays are arrays and have at least one item
    case 'array':
      let _value = value;
      if (typeof _value === 'string') {
        _value = _value.split(',');
      }
      return Array.isArray(_value) && _value.length > 0;

    // Ensure strings are strings and have at least one character
    case 'string':
    default:
      return typeof value === 'string' && value.length > 0;
  }
}
