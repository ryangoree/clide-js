import prompts from 'prompts';
import { ClideError, ERROR_PREFIX } from './errors';

/**
 * Variation of `prompts.PromptObject` with a few changes:
 * - name must be a string
 * - message is required
 * - separator is always ','
 *
 * @see https://github.com/terkelg/prompts#-prompt-objects
 */
export type PromptOptions = Omit<
  prompts.PromptObject,
  'name' | 'message' | 'separator'
> & {
  // only allow string names
  name: string;
  // make the message property required since prompts throws an error if it's
  // not defined.
  message: NonNullable<prompts.PromptObject['message']>;
};

export class ClideClient {
  log(...message: any) {
    console.log(...message);
  }

  error(error: any) {
    const clientError = new ClientError(error);
    console.error(
      `\n${
        process.env.NODE_ENV === 'development'
          ? clientError.stack
          : `${ERROR_PREFIX}Clide Error: ${clientError.message}`
      }`,
    );
    return clientError;
  }

  warn(...warning: any) {
    console.warn(...warning);
  }

  async prompt(prompt: PromptOptions): Promise<any> {
    const result = await prompts({
      ...prompt,
      separator: ',',
    });
    return result[prompt.name];
  }
}

/**
 * An error that has already been handled by the client.
 */
export class ClientError extends ClideError {}
