import { run } from 'clide-js';
import { expect, test, vi } from 'vitest';
import { commandMenu } from './command-menu';
import { commandMenuPrompt } from './command-menu-prompt';

vi.mock('./command-menu-prompt', async (importOriginal) => {
  const original: any = await importOriginal();
  return {
    ...original,
    commandMenuPrompt: vi.fn(() => []),
  };
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
