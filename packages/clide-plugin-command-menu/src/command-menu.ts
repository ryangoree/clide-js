import type { OptionValues, Plugin } from 'clide-js';
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

  /**
   * Whether the command menu is enabled. Can be a boolean or a  predicate
   * function that determines whether the command menu should be shown. The
   * predicate will only be called if the conditions for showing the menu are
   * met.
   */
  enabled?: boolean | ((options: OptionValues) => Promise<boolean> | boolean);
}

/**
 * Command Menu
 *
 * A Clide-JS Plugin that:
 * 1. Prompts the user to choose a subcommand if the current command requires
 *    it.
 * 2. After a subcommand is chosen, checks if it also needs a subcommand.
 * 3. If further subcommands are needed, displays a new prompt with an added '↩
 *    back' option.
 * 4. Continues this process until all necessary subcommands are selected.
 *
 * Note: The '↩ back' option allows users to return to the previous menu at any
 * stage.
 */
export function commandMenu({
  title,
  titleColors = ['#2EFFAF', '#0FC2C2'],
  message = 'Choose a command',
  showDescriptions = true,
  maxDescriptionLength = 60,
  enabled,
}: CommandMenuOptions = {}): Plugin {
  return {
    name: 'command-menu',
    version: '0.1.0',
    description:
      'Prompts the user to select a subcommand when a command requires one.',

    init: ({ hooks }) => {
      if (enabled === false) return true;
      const isPermanentlyEnabled = enabled === true;
      const isEnabledFn = typeof enabled === 'function' ? enabled : () => true;

      // Show the menu if the command string is empty
      hooks.on(
        'beforeResolve',
        async ({
          commandString,
          commandsDir,
          context,
          addResolvedCommands,
          skip,
        }) => {
          if (commandString.length) return;

          if (!isPermanentlyEnabled) {
            const parsed = await context.parseCommand();
            const isEnabled = await isEnabledFn(parsed.options);
            if (!isEnabled) return;
          }

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
              onCancel: async () => {
                await context.exit();
              },
            });
            addResolvedCommands(selectedCommands);
            skip();
          }
        },
      );

      // Show the menu if the last resolved command requires a subcommand
      hooks.on(
        'afterResolve',
        async ({ context, resolvedCommands, addResolvedCommands }) => {
          if (!isPermanentlyEnabled) {
            const parsed = await context.parseCommand();
            const isEnabled = await isEnabledFn(parsed.options);
            if (!isEnabled) return;
          }

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
              onCancel: async () => {
                await context.exit();
              },
            });
            addResolvedCommands(selectedSubcommands);
          }
        },
      );

      return true;
    },
  };
}
