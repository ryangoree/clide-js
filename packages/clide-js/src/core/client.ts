import prompts, { type PromptType, type PromptObject } from 'prompts';
import type { } from 'src/core/options/option';
import { ClideError, ClientError } from './errors';

/**
 * A variation of {@linkcode PromptObject} with a few changes:
 * - name must be a string
 * - message is required
 * - separator is always ','
 *
 * @see [GitHub - terkelg/prompts - Prompt Objects](https://github.com/terkelg/prompts#-prompt-objects)
 * @group Client
 */
// TODO: replace with own type?
export type PromptOptions<T extends PromptType = PromptType> = Omit<
  PromptObject,
  'name' | 'message' | 'separator' | 'type'
> & {
  // make the message property required since prompts throws an error if it's
  // not defined.
  message: NonNullable<prompts.PromptObject['message']>;
  // make the type property optional since we'll default to 'text'
  type?: T;
};

/**
 * A client that can be used to log messages, errors, and prompt the user.
 *
 * This is a **WIP** and will be built out more in the future. For now, it's
 * just a simple wrapper around `console` and
 * [prompts](https://github.com/terkelg/prompts).
 * @group Client
 */
export class Client {
  /**
   * Log a message to stdout.
   * @param message - Any number of arguments to log.
   */
  log(...message: unknown[]) {
    console.log(...message);
  }

  /**
   * Log an error message to stderr.
   * @param error - The error to log.
   * @returns The error wrapped in a {@linkcode ClientError}.
   */
  error(error: any) {
    const clientError = new ClientError(error);
    console.error(
      `\n${
        process.env.NODE_ENV === 'development'
          ? clientError.stack
          : `${ClideError.prefix}Error: ${clientError.message}`
      }`,
    );
    return clientError;
  }

  /**
   * Log a warning message to stdout.
   * @param warning - Any number of arguments to log.
   */
  warn(...warning: any) {
    console.warn(...warning);
  }

  /**
   * Prompt the user for input.
   * @param prompt - The prompt options.
   * @returns The user's input.
   *
   * @see https://github.com/terkelg/prompts#-prompt-objects
   */
  async prompt<T extends PromptType = PromptType>(
    prompt: PromptOptions<T>,
  ): Promise<PromptTypeMap[T]> {
    const { value } = await prompts({
      type: 'text',
      active: 'yes',
      inactive: 'no',
      ...prompt,
      name: 'value',
      separator: ',',
    });
    return value;
  }
}

type PromptTypeMap = PromptTypeMapDef<{
  text: string;
  password: string;
  invisible: string;
  number: number;
  confirm: boolean;
  list: string[];
  toggle: boolean;
  select: string;
  multiselect: string[];
  autocomplete: string;
  date: Date;
  autocompleteMultiselect: string[];
}>;

/**
 * Ensures the type map is up-to-date. If any types are missing, a type error
 * will be thrown.
 */
type PromptTypeMapDef<T extends Record<PromptType, unknown>> = T;
