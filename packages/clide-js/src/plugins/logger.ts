import { Plugin } from 'src/core/plugin';
import { State } from 'src/core/state';

/**
 * A minimal logger plugin that logs the result of each execution step.
 * @group Plugins
 */
export function logger(): Plugin {
  return {
    name: 'logger',
    version: '0.0.0',
    description: 'Logs the result of each execution step.',
    init: ({ client, commandString, hooks }) => {
      client.log(prefix('received command'), commandString);

      hooks.on('beforeNext', ({ data, state }) => {
        log('next', data, state);
      });

      hooks.on('beforeEnd', ({ data, state }) => {
        log('end', data, state);
      });

      return true;
    },
  };

  function prefix(str: string) {
    return `[🪵 ${new Date().toISOString()}] ${str}:`;
  }

  function log(
    transitionName: string,
    data: unknown,
    { command, context, params }: State,
  ) {
    if (!command) return;
    context.client.log(prefix(transitionName), {
      commandName: command.commandName,
      commandTokens: command.commandTokens,
      commandPath: command.commandPath,
      params,
      data,
    });
  }
}
