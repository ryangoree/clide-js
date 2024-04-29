// Must be imported first
import { mockCommandModule } from 'clide-js/test-utils';

import { ResolvedCommand, passThroughCommand, run } from 'clide-js';
import { Mock, beforeEach, expect, test, vi } from 'vitest';
import { commandMenu } from './command-menu';
import {
  CommandMenuPromptOptions,
  commandMenuPrompt,
} from './command-menu-prompt';

vi.mock('./command-menu-prompt', async (importOriginal) => {
  const original: any = await importOriginal();
  return {
    ...original,
    commandMenuPrompt: vi.fn<[CommandMenuPromptOptions], ResolvedCommand[]>(
      ({ commandsDir }): ResolvedCommand[] => [
        {
          command: {
            handler: vi.fn(({ next, data }) => next(data)),
          },
          commandName: 'mock-command',
          remainingCommandString: '',
          commandPath: `${commandsDir}/mock-command`,
          commandTokens: ['mock-command'],
          subcommandsDir: `${commandsDir}/mock-command`,
          params: {},
        },
      ],
    ),
  };
});

beforeEach(() => {
  (commandMenuPrompt as Mock).mockClear();
});

test('It shows the command menu when no command string is provided', async () => {
  await run({
    command: '',
    // Pass a commandsDir to prevent clide-js from trying to auto-detect it,
    // which would cause an error because there is none.
    commandsDir: 'commands',
    plugins: [commandMenu()],
  });

  expect(commandMenuPrompt).toHaveBeenCalled();
});

test('It shows the command menu when the last resolved command requires a subcommand', async () => {
  mockCommandModule('commands/foo', passThroughCommand);

  await run({
    command: 'foo',
    commandsDir: 'commands',
    plugins: [commandMenu()],
  });

  expect(commandMenuPrompt).toHaveBeenCalled();
});

test("It doesn't show the command menu when the last resolved command doesn't require a subcommand", async () => {
  mockCommandModule('commands/foo');

  await run({
    command: 'foo',
    commandsDir: 'commands',
    plugins: [],
  });

  expect(commandMenuPrompt).not.toHaveBeenCalled();
});
