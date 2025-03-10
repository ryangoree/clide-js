import { Client, type PromptOptions } from 'src/core/client';
import type {
  OptionConfig,
  OptionConfigPrimitiveType,
  OptionPrimitiveType,
  OptionType,
} from 'src/core/options/options';
import { validateOptionType } from 'src/core/options/validate-options';
import type { MaybePromise, MaybeReadonly } from 'src/utils/types';

interface OptionPromptParams<
  TConfig extends OptionConfig = OptionConfig,
  TValue = MaybeReadonly<OptionPrimitiveType<TConfig['type']>> | undefined,
> {
  /**
   * The name of the option.
   */
  name: string;
  /**
   * The option config.
   */
  config?: TConfig;
  /**
   * The client to use for prompting.
   */
  client?: Client;
  /**
   * The prompt to show the user if no value is provided (optional).
   */
  prompt?: string | PromptOptions;
  /**
   * The validation function (optional).
   */
  validate?: (value: TValue) => MaybePromise<boolean>;
  /**
   * A function to call when the user cancels a prompt. By default, this will
   * exit the process.
   */
  onCancel?: () => void;
}

/**
 * Creates an `OptionGetter` function to dynamically retrieve the value of a
 * command option. The getter function accepts an optional `OptionGetterOptions`
 * object, which can be used to prompt the user when no value is provided and/or
 * validate the value.
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
export async function optionPrompt<
  TConfig extends OptionConfig = OptionConfig,
  TValue = MaybeReadonly<OptionConfigPrimitiveType<TConfig>> | undefined,
>({
  name,
  config,
  client = new Client(),
  onCancel,
  prompt,
  validate,
}: OptionPromptParams<TConfig, TValue>): Promise<TValue> {
  // Assign a default validate function if the option is required and no
  // validate function is provided
  if (config?.required && !validate) {
    validate = (value) =>
      !!validateOptionType({
        value,
        name,
        config,
        throws: false,
      });
  }

  // Prompt for the option value if not provided and a prompt is provided
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

  const promptOptionOverrides =
    typeof prompt === 'string'
      ? { message: prompt }
      : prompt || { message: `Enter ${name}` };

  const promptOptions: PromptOptions = {
    type,
    choices: config?.choices?.map((choice) => ({
      title: choice,
      value: choice,
    })),
    validate: validate
      ? (_value) => {
          // prompts won't always pass the initial value to the validate
          // function, so we need to check for an empty string and use the
          // default value if provided.
          //
          // see: https://github.com/terkelg/prompts/issues/410
          let value = _value;
          if (value === '' && config?.default !== undefined) {
            value = config?.default;
          }
          const preppedValue = prepValueForValidation(value, config?.type);
          return validate?.(preppedValue as TValue);
        }
      : undefined,

    // options passed to the getter take precedence over the config
    ...promptOptionOverrides,

    onState: (state, ...rest) => {
      promptOptionOverrides.onState?.(state, ...rest);
      if (state.aborted || state.exited) {
        onCancel?.();
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
  if (promptOptions.initial === undefined && config?.default !== undefined) {
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

  let value = (await client.prompt(promptOptions)) as TValue;

  // If no value, use the default
  if (value === undefined) {
    value = config?.default as TValue;
  }

  return value;
}

// Internal //

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
