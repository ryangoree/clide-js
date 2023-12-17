import { Plugin } from 'clide-js';
import { commandMenuPrompt } from './command-menu-prompt.js';

export interface CommandMenuOptions {
  /**
   * The title to show in the prompt.
   */
  title?: string;

  /**
   * The colors to use for the title.
   * @default
   * ['#2EFFAF', '#0FC2C2']
   */
  titleColors?: `#${string}`[];

  /**
   * The message to show when prompting the user to select a command.
   * @default "Choose a command"
   */
  message?: string;

  /**
   * Set to false to prevent showing the command module's `describe` export in
   * the choices.
   * @default true
   */
  showDescriptions?: boolean;

  /**
   * The max character length of the description. If the description goes past
   * this, it will be truncated with an ellipses.
   * @default 60
   */
  maxDescriptionLength?: number;
}

/**
 * A Clide-JS plugin that prompts the user to select a subcommand when required.
 * After the user selects a subcommand, the command will be resolved and if it
 * also requires a subcommand, the user will be prompted again, but this time
 * can also select `↩ back` to go back to the previous menu. This will continue
 * until the user has selected all required subcommands.
 */
export function commandMenu({
  title,
  titleColors = ['#2EFFAF', '#0FC2C2'],
  message = 'Choose a command',
  showDescriptions = true,
  maxDescriptionLength = 60,
}: CommandMenuOptions = {}): Plugin {
  return {
    name: 'clide-command-menu',
    version: '0.0.0',
    description:
      'Prompts the user to select a subcommand when a command requires one.',

    init: ({ hooks }) => {
      // Show the menu if the command string is empty
      hooks.on(
        'preResolve',
        async ({
          commandString,
          commandsDir,
          context,
          addResolvedCommands,
          skip,
        }) => {
          if (!commandString.length) {
            const selectedCommands = await commandMenuPrompt({
              title,
              titleColors,
              message,
              commandsDir,
              showDescriptions,
              maxDescriptionLength,
              resolveFn: ({ commandString, commandsDir }) =>
                context.resolveCommand(commandString, commandsDir),
            });
            addResolvedCommands(selectedCommands);
            skip();
          }
        },
      );

      // Show the menu if the last resolved command requires a subcommand
      hooks.on(
        'postResolve',
        async ({ context, resolvedCommands, addResolvedCommands }) => {
          const lastResolved = resolvedCommands[resolvedCommands.length - 1];

          if (lastResolved?.command.requiresSubcommand) {
            const selectedSubcommands = await commandMenuPrompt({
              title,
              titleColors,
              commandsDir: lastResolved.subcommandsDir,
              message,
              showDescriptions,
              maxDescriptionLength,
              resolveFn: ({ commandString, commandsDir }) =>
                context.resolveCommand(commandString, commandsDir),
            });
            addResolvedCommands(selectedSubcommands);
          }
        },
      );

      return true;
    },
  };
}
