import { command } from 'src/core/command';

/**
 * Test Cases:
 *
 *   // Defaults passed to invoked command?
 * - DEFAULT, no value, no prompt, no passed value -> no option
 *
 *   // Defaults passed to invoked command?
 * - DEFAULT, no value, no prompt, no passed value -> no default
 *
 *   // Parsed values passed to invoked command?
 * - No default, VALUE, no prompt, no passed value -> no default
 *
 *   // Prompt updates AND passed to invoked command?
 * - No default, no value, PROMPT, no passed value -> no default
 *
 *   // Override passed to invoked command?
 * - No default, no value, no prompt, PASSED_VALUE -> no default
 *
 *
 *   // Values updated from invoked default?
 * - no default, no value, no prompt, no passed value -> DEFAULT
 *
 *   // Default priority?
 * - DEFAULT, no value, no prompt, no passed value -> DEFAULT
 */

export default command({
  description: 'Get a greeting',
  options: {
    foo: {
      type: 'string',
      default: 'default bar',
    },
  },
  handler: async ({ options, end }) => {
    console.log('------\nBar Values:', options.values, '\n------');

    end();
  },
});
