import { MaybePromise } from 'src/utils/types';
import parse from 'yargs-parser';
import { OptionPrimitiveType, OptionsConfig } from './options/types';

/**
 * Command tokens representing commands, subcommands, and/or params.
 * @group Parse
 */
export type Tokens = string[];

/**
 * The values for each option.
 * @group Parse
 */
export type OptionValues = Record<string, OptionPrimitiveType | undefined>;

/**
 * The result of parsing a command string.
 * @group Parse
 */
export type ParsedCommand = {
  tokens: Tokens;
  options: OptionValues;
};

/**
 * A function to parse a command string.
 * @group Parse
 */
export type ParseCommandFn = (
  commandString: string,
  optionsConfig: OptionsConfig,
) => MaybePromise<ParsedCommand>;

/**
 * Parse a command string into command tokens and options values.
 *
 * @param commandString - The command string to parse.
 * @param optionsConfig  - The options config to use when parsing. Only options
 *  that are defined in the config will be included in the option values. Any
 *  options that are not defined in the config will be treated as command
 *  tokens.
 * @returns The parsed command tokens and options values.
 * @group Parse
 */
export function parseCommand(
  commandString: string,
  optionsConfig: OptionsConfig,
): ParsedCommand {
  // Prepare the options config for yargs-parser
  const parseOptions: parse.Options = {
    alias: {},
    array: [],
    boolean: [],
    number: [],
    string: [],
    narg: {},
  };

  for (const [key, option] of Object.entries(optionsConfig)) {
    if (option.alias) {
      parseOptions.alias![key] = option.alias as string[];
    }

    if (option.nargs) {
      parseOptions.narg![key] = option.nargs;
    }

    switch (option.type) {
      case 'array':
        parseOptions.array!.push(key as any);
        if (option.string) {
          parseOptions.string!.push(key as any);
        }
        break;
      case 'boolean':
        parseOptions.boolean!.push(key as any);
        break;
      case 'number':
        parseOptions.number!.push(key as any);
        break;
      case 'string':
      default:
        parseOptions.string!.push(key as any);
        break;
    }
  }

  // Parse the command string with yargs-parser
  let { _: tokens, ...options } = parse(commandString, {
    ...parseOptions,
    configuration: {
      'unknown-options-as-args': true,
    },
  });

  // Treat unknown options as boolean flags
  tokens = tokens.filter((token) => {
    if (typeof token === 'string' && token.startsWith('-')) {
      options[token.replace(/^-+/, '')] = true;
      return false;
    }
    return true;
  });

  return {
    // Coerce all tokens to strings (yargs-parser returns numbers for numbers)
    tokens: tokens.map(String),
    options,
  };
}
