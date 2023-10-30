import prompts from 'prompts';
import { ClientError, ERROR_PREFIX } from './errors';

/**
 * Variation of `prompts.PromptObject` with a few changes:
 * - name must be a string
 * - message is required
 * - separator is always ','
 *
 * @see https://github.com/terkelg/prompts#-prompt-objects
 * @group Client
 */
// TODO: replace with own type?
export type PromptOptions = Omit<
  prompts.PromptObject,
  'name' | 'message' | 'separator'
> & {
  // make the message property required since prompts throws an error if it's
  // not defined.
  message: NonNullable<prompts.PromptObject['message']>;
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
  log(...message: any) {
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
          : `${ERROR_PREFIX}Error: ${clientError.message}`
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
  async prompt(prompt: PromptOptions): Promise<any> {
    const { value } = await prompts({
      ...prompt,
      name: 'value',
      separator: ',',
    });
    return value;
  }
}
