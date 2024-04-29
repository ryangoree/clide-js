import path from 'path';
import { CommandModule } from 'src/core/command';
import { NotFoundError } from 'src/core/errors';
import { parseCommand } from 'src/core/parse';
import { State } from 'src/core/state';
import { formatFileName } from 'src/utils/format-file-name';
import { vi } from 'vitest';

const mockCommandDirs = new Map<string, Set<string>>();

vi.mock('fs', async (importOriginal) => {
  const fs = (await importOriginal()) as typeof import('fs');
  const mod = {
    ...fs,
    promises: {
      ...fs.promises,
      // Mock fs.stat to return isDirector()y = true for command directories
      stat: vi.fn(async (path, options) => {
        return fs.promises.stat(path, options).catch(() => {
          // If the path is a command directory, return isDirectory() = true
          if (mockCommandDirs.has(path.toString())) {
            return Promise.resolve({
              isDirectory: vi.fn(() => true),
            }) as any;
          }

          // Otherwise, reject
          return Promise.reject();
        });
      }),

      // Mock fs.readdir to return the command names for command directories
      readdir: vi.fn(async (path, opts) => {
        return fs.promises.readdir(path, opts).catch(() => {
          // If the path is a command directory, return the command names
          if (mockCommandDirs.has(path.toString())) {
            return Promise.resolve([...mockCommandDirs.get(path.toString())!]);
          }
        });
      }),
    },
    statSync: vi.fn((path, opts) => {
      try {
        return fs.statSync(path, opts);
      } catch (err) {
        // If the path is a command directory, return isDirectory() = true
        if (mockCommandDirs.has(path.toString())) {
          return {
            isDirectory: vi.fn(() => true),
          } as any;
        }

        // Otherwise, throw
        throw err;
      }
    }),
  };
  (mod as any).default = mod;
  return mod;
});

/**
 * Unmock all command modules that have been mocked. Making them throw a
 * NotFoundError when imported.
 */
export async function unmockAllCommandModules() {
  for (const [commandDir, commandNames] of mockCommandDirs.entries()) {
    for (const commandName of commandNames) {
      vi.doMock(path.join(commandDir, commandName), () => {
        const mod = {
          handler: vi.fn(() => {
            throw new NotFoundError(commandName, commandDir);
          }),
        };
        (mod as any).default = mod;
        return mod;
      });
    }
  }
  mockCommandDirs.clear();
}

/**
 * Mock a command module so that it can be imported and resolved during testing.
 *
 * @example
 * mockCommandModule('commands/foo/bar', {
 *  handler: ({ result, data }) => result(data),
 * });
 */
export function mockCommandModule(
  commandPath: string,
  commandModule?: CommandModule,
) {
  const formattedFilePath = formatFileName(commandPath);
  const commandDir = path.dirname(commandPath);
  const commandName = path.basename(commandPath);

  // Keep track of the command directories and names that have been mocked
  if (mockCommandDirs.has(commandDir)) {
    mockCommandDirs.get(commandDir)?.add(commandName);
  } else {
    mockCommandDirs.set(commandDir, new Set([commandName]));
  }

  const mock = commandModule || {
    handler: vi.fn(({ next, data }: State) => next(data)),
  };

  vi.doMock(formattedFilePath, () => {
    return {
      ...mock,
      default: mock,
    };
  });

  return {
    mock,
    unmock: () => {
      vi.doUnmock(formattedFilePath);
    },
  };
}

/**
 * Mock multiple command modules so that they can be imported and resolved
 *
 * @example
 * mockCommandModules({
 *   'commands/foo': {
 *     handler: ({ next, data }) => next(data),
 *   },
 *   'commands/foo/bar': {
 *     handler: ({ end, data }) => end(data),
 *   },
 * });
 */
export function mockCommandModules(
  commandModules: Record<string, CommandModule>,
) {
  const results = Object.entries(commandModules).map(
    ([commandPath, commandModule]) =>
      mockCommandModule(commandPath, commandModule),
  );
  return {
    mocks: Object.fromEntries(
      results.map(({ mock }, i) => [Object.keys(commandModules)[i], mock]),
    ),
    unmock: () => {
      for (const { unmock } of results) unmock();
    },
  };
}

/**
 * Mock the command modules for the given command string so that they can be
 * imported and resolved during testing.
 */
export function mockCommandStringModules(
  commandString: string,
  commandsDir: string,
) {
  const unMockFns: (() => void)[] = [];
  const { tokens } = parseCommand(commandString, {});
  let commandPath = commandsDir;

  // mock each command in the command string
  for (const token of tokens) {
    commandPath = path.join(commandPath, token);
    const { unmock } = mockCommandModule(commandPath, {
      handler: vi.fn(({ next, data }) => next(data)),
    });
    unMockFns.push(unmock);
  }

  return {
    unmock: () => {
      for (const unmock of unMockFns) unmock();
    },
  };
}
