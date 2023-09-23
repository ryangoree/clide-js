import { EventEmitter } from 'node:events';
import { ClideClient, ClientError } from './client';
import { ClideEmitter } from './emitter';
import { UsageError } from './errors';
import { execute, getExecutionSteps } from './execute';
import { getHelp } from './help';
import { ClidePlugin, initPlugins } from './plugins';
import { hideBin } from './utils/argv';
import { deepFreezeClone } from './utils/deep-freeze-clone';
import { parseCommand } from './parse';

interface ClideOptions {
  /**
   * The command string or array to be parsed and executed. If not provided, it
   * defaults to system arguments.
   */
  command?: string | string[];
  /**
   * The directory path for command definitions.
   */
  commandsDir?: string;
  /**
   * Initial context or data to pass to commands during execution.
   */
  initialData?: any;
  /**
   * An array of plugins that can modify or augment the behavior of commands.
   */
  plugins?: ClidePlugin[];
}

/**
 * Main entry point for the Clide CLI framework. Provides an easy interface for
 * parsing, handling, and executing commands with optional plugin support.
 *
 * Clide works by:
 * - Parsing the provided command.
 * - Handling system-level concerns like showing help instructions.
 * - Initializing plugins that can enhance or modify command behavior.
 * - Determining the execution steps based on the tokenized command input
 * - Executing the steps to produce the final output or perform the desired
 *   action.
 *
 * @param options - Configuration for the Clide execution.
 *
 * @returns The result of the executed command, or `void` if help information is
 * displayed.
 *
 * @example
 * clide({
 *   command: 'build ./src -watch --env=prod',
 *   plugins: [fooPlugin, barPlugin]
 * });
 */
export async function clide({
  command = hideBin(process.argv),
  commandsDir = './commands',
  initialData,
  plugins,
}: ClideOptions) {
  // parse the command into tokens (positional args and subcommands) and options
  const { tokens, options } = await parseCommand(command);

  // create helpers
  const client = new ClideClient();
  const emitter = new EventEmitter() as ClideEmitter;

  // if the help option is present, print help and return
  if (options.help || options.h) {
    const { helpText, error } = await getHelp({ tokens, commandsDir });
    if (error) {
      client.error(error);
    }
    client.log(helpText);
    return error;
  }

  let pluginsMeta: ClidePlugin['meta'][] = [];
  if (plugins) {
    pluginsMeta = await initPlugins(
      plugins,
      deepFreezeClone({
        tokens,
        options,
        emitter,
        client,
        plugins: pluginsMeta,
      }),
    );
  }

  try {
    // get steps for each token in the command. Each step is a function that:
    //  - adds the token's params and option getter to the state
    //  - executes the command handler with the updated state
    const steps = await getExecutionSteps({ tokens, commandsDir, client });

    // begin execution
    return await execute({
      steps,
      tokens,
      options,
      emitter,
      client,
      plugins: pluginsMeta,
      initialData,
    });
  } catch (err) {
    if (err instanceof UsageError) {
      const { helpText } = await getHelp({ tokens, commandsDir });
      client.error(err);
      client.log(helpText);
      return err;
    }

    // simply return client errors since they're handled by the client
    if (err instanceof ClientError) {
      return err;
    }

    throw err;
  }
}
