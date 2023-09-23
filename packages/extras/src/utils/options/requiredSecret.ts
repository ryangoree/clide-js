import prompts from 'prompts';
import { requiredOption } from './requiredOption.js';
import { UntypedQuestion } from './types.js';

export async function requiredSecret(
  value: string | undefined,
  question: UntypedQuestion,
  options?: prompts.Options,
): Promise<string> {
  return requiredOption(
    value,
    {
      validate: Boolean,
      ...question,
      type: 'password',
    },
    options,
  );
}

const foo = 255;
