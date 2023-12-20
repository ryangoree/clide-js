import { UsageError } from 'src/core/errors';
import { getHelp } from 'src/core/help';
import { removeOptionTokens } from 'src/core/options/remove-option-tokens';
import { Plugin } from 'src/core/plugin';

/**
 * Options for the help plugin.
 * @group Plugins
 */
export interface HelpPluginOptions {
  /**
   * The max line-length for the help text.
   * @default 80
   */
  maxWidth?: number;
}

/**
 * A Clide-JS plugin that prints help information on execution if the `-h` or
 * `--help` flags are present or when a usage error occurs and skips actual
 * execution.
 *
 * If there's a usage error, and the help flag is not present, the usage error
 * will also be printed and set as the command's result.
 * @group Plugins
 */
export function help({ maxWidth = 80 }: HelpPluginOptions = {}): Plugin {
  return {
    name: 'help',
    version: '0.0.0',
    description:
      'Prints help information on execution if the -h or --help flags are present or when a usage error occurs.',
    init: ({ addOptions, client, hooks }) => {
      let usageError: UsageError | undefined = undefined;
      let isExecuting = false;
      let didSetResult = false;

      addOptions({
        help: {
          description: 'Prints help information',
          type: 'boolean',
          alias: ['h'],
          default: false,
        },
      });

      // Save usage errors so we can print them when the command is executed
      hooks.on('error', async ({ error, ignore, context }) => {
        if (error instanceof UsageError) {
          usageError = error;

          // If the command is already executing, print the help text immediately
          if (isExecuting) {
            let helpText = '';

            // Try to get the help text for the command and print any errors
            try {
              const help = await getHelp({ context, maxWidth });
              helpText = help.helpText;
            } catch (error) {
              client.error(error);
            }

            // Print the usage error
            if (usageError) {
              client.error(usageError);
            }

            // Print the help text (empty string if there was an error)
            client.log(helpText);
          }

          // Ignore the error to so it doesn't get printed twice
          ignore();
        }
      });

      // Allow the command to be executed with just the help flag
      hooks.on('preResolve', async ({ commandString, skip }) => {
        if (!commandString.length) return;

        const commandStringWithoutHelp = removeOptionTokens(commandString, {
          help: true,
          h: true,
        });

        // If the command string is empty after removing the help flag, skip
        // resolving the command which would have thrown a usage error.
        if (!commandStringWithoutHelp.length) {
          skip();
        }
      });

      // Avoid continuing to resolve the command if the help flag is present or
      // if a usage error occurred previously
      hooks.on('preResolveNext', async ({ context, skip, lastResolved }) => {
        // If there's already a usage error, skip resolving the next command
        if (usageError) {
          skip();
          return;
        }

        // check if the help flag was present in the previously resolved command
        // string. If it's in the remaining command string we can ignore it for
        // now because it will be handled later.
        const stringToCheck = context.commandString.slice(
          0,
          -lastResolved.remainingCommandString.length,
        );
        const { options } = await context.parseCommand(stringToCheck);

        if (options.help) {
          skip();
        }
      });

      // Print the help text and skip execution if the help flag is present or if
      // a usage error occurred previously
      hooks.on('preExecute', async ({ state, setResultAndSkip, skip }) => {
        isExecuting = true;

        const { help } = await state.options.get(['help']);

        // If there's no error and the help flag isn't present, do nothing
        if (!usageError && !help) return;

        const { helpText } = await getHelp({
          context: state.context,
          maxWidth,
        });

        // Only print the usage error if help wasn't requested
        if (usageError && !help) {
          client.error(usageError);
          setResultAndSkip(usageError);
          didSetResult = true;
        }

        client.log(helpText);

        // Ensure the execution is skipped even if the result wasn't set
        skip();
      });

      // Reset the isExecuting flag and set the result if there was a usage error
      // and it wasn't already set in the preExecute hook. This can happen if a
      // usage error is thrown during execution.
      hooks.on('postExecute', async ({ setResult }) => {
        isExecuting = false;

        if (usageError && !didSetResult) {
          setResult(usageError);
        }
      });

      return true;
    },
  };
}
