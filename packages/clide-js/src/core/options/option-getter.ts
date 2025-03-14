import type { Client, PromptOptions } from 'src/core/client';
import { OptionsError, UsageError } from 'src/core/errors';
import type { MaybePromise, MaybeReadonly } from 'src/utils/types';
import type { OptionConfig, OptionPrimitiveType, OptionType } from './option';
import { validateOptionType } from './validate-options';

/**
 * A function to dynamically retrieve the value of a command option.
 * @group Options
 */
export type OptionGetter<T> = (
  getterOptions?: OptionGetterOptions<T>,
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
   * The option config.
   */
  config?: TConfig;
  /**
   * The client to use for prompting.
   */
  client: Client;
  /**
   * A function to call when the user cancels a prompt. By default, this will
   * exit the process.
   */
  onPromptCancel?: () => void;
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
  onPromptCancel,
}: OptionGetterFactoryOptions<TConfig, TValue>): OptionGetter<TValue> {
  let cachedValue: TValue | undefined;

  return async ({ prompt, validate }: OptionGetterOptions<TValue> = {}) => {
    // Avoid prompting for the same option multiple times
    if (cachedValue !== undefined) {
      return cachedValue;
    }

    let validateFn = validate;

    // Use the default validate function if the option is required and no
    // validate function is provided
    if (config?.required && !validateFn) {
      validateFn = (value) =>
        defaultValidate(value, config.type, config.choices);
    }

    // Prompt for the option value if not provided and a prompt is provided
    if (value === undefined && (prompt || config?.required)) {
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
          type = config?.choices?.length ? 'multiselect' : 'list';
          break;
        case 'secret':
          type = 'password';
          break;
        default:
          type = config?.choices?.length ? 'select' : 'text';
          break;
      }

      let didCancel = false;
      const promptOptions: PromptOptions = {
        type,
        choices: config?.choices?.map((choice) => ({
          title: choice,
          value: choice,
        })),
        validate: validateFn
          ? (_value) => {
              // prompts won't always pass the initial value to the validate
              // function, so we need to check for an empty string and use the
              // default value if provided.
              // see: https://github.com/terkelg/prompts/issues/410
              let value = _value;
              if (value === '' && config?.default !== undefined) {
                value = config?.default;
              }
              const preppedValue = prepValueForValidation(value, config?.type);
              return validateFn?.(preppedValue as TValue);
            }
          : undefined,

        // options passed to the getter take precedence over the config
        ...(typeof prompt === 'string'
          ? { message: prompt }
          : prompt || { message: `Enter ${name}` }),

        onState: (state) => {
          if (state.aborted || state.exited) {
            didCancel = true;
          }
          return state;
        },
      };

      // Add additional options for specific prompt types
      switch (promptOptions.type) {
        case 'autocomplete':
        case 'autocompleteMultiselect': {
          // These options are not part of the types package, but do exist.
          (promptOptions as any).clearFirst ??= true;

          // If no choices are matched, accept the input as-is
          promptOptions.suggest ??= async (input, choices) => {
            if (!input) return choices;
            const lowerInput = input.toLowerCase();
            const filtered = choices.filter((choice) => {
              const lowerTitle = choice.title.toLowerCase();
              if (
                lowerTitle.slice(0, lowerInput.length) === lowerInput ||
                lowerInput.slice(0, lowerTitle.length) === lowerTitle
              ) {
                return true;
              }
              const lowerValue = choice.value?.toLowerCase();
              return (
                lowerValue &&
                (lowerValue.slice(0, lowerInput.length) === lowerInput ||
                  lowerInput.slice(0, lowerValue.length) === lowerValue)
              );
            });
            return [{ title: input }, ...filtered];
          };

          break;
        }
      }

      // If an initial value is not provided, use the default value
      if (
        promptOptions.initial === undefined &&
        config?.default !== undefined
      ) {
        const defaultValue = Array.isArray(config?.default)
          ? config?.default.join(',')
          : config?.default;

        switch (promptOptions.type) {
          case 'select': {
            // Ignore the default value if the choices aren't an array
            if (!Array.isArray(promptOptions.choices)) break;

            const defaultChoice = promptOptions.choices?.findIndex(
              (choice) =>
                choice.title === defaultValue || choice.value === defaultValue,
            );
            if (defaultChoice > -1) {
              promptOptions.initial = defaultChoice;
            }
            break;
          }

          case 'date':
            promptOptions.initial = new Date(defaultValue.toString());
            break;

          default:
            promptOptions.initial = defaultValue as any;
        }
      }

      value = (await client.prompt(promptOptions)) as TValue;
      if (didCancel) {
        onPromptCancel?.();
      }
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
        throw new OptionsError(
          `Invalid value for option "${name}": ${value}${config?.choices ? ` (choices: ${config.choices.join(', ')})` : ''}`,
        );
      }
    }

    // Cache the value and return it
    cachedValue = value;
    return value;
  };
}

function prepValueForValidation<TOptionConfig extends OptionType = OptionType>(
  value: unknown,
  optionType?: TOptionConfig,
): OptionPrimitiveType<TOptionConfig> {
  switch (optionType) {
    case 'array':
      if (typeof value === 'string') {
        return value.split(',') as OptionPrimitiveType<TOptionConfig>;
      }
      return value as OptionPrimitiveType<TOptionConfig>;

    default:
      return value as OptionPrimitiveType<TOptionConfig>;
  }
}

/**
 * Configuration options for the {@linkcode OptionGetter} function.
 * @Group Options
 */
interface OptionGetterOptions<T> {
  /**
   * The prompt to show the user if no value is provided (optional).
   */
  prompt?: string | PromptOptions;
  /**
   * The validation function (optional).
   */
  validate?: (value: T) => MaybePromise<boolean>;
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
function defaultValidate(
  value: unknown,
  optionType?: OptionType,
  choices = [value],
) {
  switch (optionType) {
    // Ensure numbers are numbers
    case 'number':
      return typeof value === 'number' && !Number.isNaN(value);

    // Ensure booleans are booleans
    case 'boolean':
      return typeof value === 'boolean';

    // Ensure arrays are arrays and have at least one item
    case 'array': {
      let _value = value;
      if (typeof _value === 'string') {
        _value = _value.split(',');
      }
      return (
        Array.isArray(_value) &&
        _value.length > 0 &&
        _value.every((v) => choices.includes(v))
      );
    }
    default:
      return (
        typeof value === 'string' && value.length > 0 && choices.includes(value)
      );
  }
}
