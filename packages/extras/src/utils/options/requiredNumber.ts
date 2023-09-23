import prompts from 'prompts';
import { requiredOption } from './requiredOption.js';
import { UntypedQuestion } from './types.js';

export async function requiredNumber(
  value: number | undefined,
  question: UntypedQuestion,
  options?: prompts.Options,
): Promise<number> {
  return requiredOption(
    value,
    {
      validate: (num) => num > -1,
      ...question,
      type: 'number',
    },
    options,
  );
}
