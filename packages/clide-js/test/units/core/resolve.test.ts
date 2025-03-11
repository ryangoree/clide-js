// Must be imported first
import {
  mockCommandModules,
  unmockAllCommandModules,
} from 'test/utils/command-modules';

import { type ResolvedCommand, resolveCommand } from 'src/core/resolve';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// const mockResolvedCommand: ResolvedCommand = {
//   command: {
//     handler: () => {},
//   },
//   commandName: '',
//   commandPath: '',
//   commandTokens: [''],
//   remainingCommandString: '',
// };

describe('resolve', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    await unmockAllCommandModules();
  });

  it('resolves commands using the file system', async () => {
    const commandModules = {
      'commands/foo.js': {
        handler: () => {},
      },
      'commands/foo/bar.js': {
        handler: () => {},
      },
      'commands/foo/bar/baz.js': {
        handler: () => {},
      },
    };
    await mockCommandModules(commandModules);

    const commandString = 'foo bar baz';
    const commandsDir = 'commands';
    let resolved = await resolveCommand({
      commandString,
      commandsDir,
    });

    expect(resolved).toMatchObject({
      command: commandModules['commands/foo.js'],
      commandPath: 'commands/foo.js',
      commandName: 'foo',
      commandTokens: ['foo'],
      remainingCommandString: 'bar baz',
      resolveNext: expect.any(Function),
      subcommandsDir: 'commands/foo',
    } as ResolvedCommand);

    resolved = await resolved.resolveNext!();

    expect(resolved).toMatchObject({
      command: commandModules['commands/foo/bar.js'],
      commandPath: 'commands/foo/bar.js',
      commandName: 'bar',
      commandTokens: ['bar'],
      remainingCommandString: 'baz',
      resolveNext: expect.any(Function),
      subcommandsDir: 'commands/foo/bar',
    } as ResolvedCommand);

    resolved = await resolved.resolveNext!();

    expect(resolved).toMatchObject({
      command: commandModules['commands/foo/bar/baz.js'],
      commandPath: 'commands/foo/bar/baz.js',
      commandName: 'baz',
      commandTokens: ['baz'],
      remainingCommandString: '',
      subcommandsDir: 'commands/foo/bar/baz',
    } as ResolvedCommand);
  });

  it('resolves param commands', async () => {
    const commandModules = {
      'commands/[qux].js': {
        handler: () => {},
      },
      'commands/[qux]/[...quux].js': {
        handler: () => {},
      },
    };
    await mockCommandModules(commandModules);

    const commandString = 'do re mi';
    const commandsDir = 'commands';
    let resolved = await resolveCommand({
      commandString,
      commandsDir,
    });

    expect(resolved).toEqual({
      command: commandModules['commands/[qux].js'],
      commandName: '[qux]',
      commandPath: 'commands/[qux].js',
      commandTokens: ['do'],
      remainingCommandString: 're mi',
      resolveNext: expect.any(Function),
      params: {
        qux: 'do',
      },
      subcommandsDir: 'commands/[qux]',
    } as ResolvedCommand);

    resolved = await resolved.resolveNext!();

    expect(resolved).toEqual({
      command: commandModules['commands/[qux]/[...quux].js'],
      commandName: '[...quux]',
      commandPath: 'commands/[qux]/[...quux].js',
      commandTokens: ['re', 'mi'],
      remainingCommandString: '',
      resolveNext: undefined,
      params: {
        quux: ['re', 'mi'],
      },
      subcommandsDir: 'commands/[qux]/[...quux]',
    } as ResolvedCommand);
  });
});
