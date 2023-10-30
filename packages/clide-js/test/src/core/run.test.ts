// Must be imported first
import {
  mockCommandModule,
  mockCommandModules,
  unmockAllCommandModules,
} from 'test/mocks/command-modules';

import path from 'node:path';
import { Context } from 'src/core/context';
import { ClideError } from 'src/core/errors';
import { HookPayload } from 'src/core/hooks';
import { Plugin } from 'src/core/plugin';
import { run } from 'src/core/run';
import { State } from 'src/core/state';
import { mockPlugin, mockPluginInfo } from 'test/mocks/plugin';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

describe('run', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    unmockAllCommandModules();
  });

  it('defaults to the "<pwd>/commands" directory', async () => {
    const commandPath = path.resolve('commands/foo');
    const { mock } = mockCommandModule(commandPath);

    await run({
      command: 'foo',
    });

    // Expect the handler from the default commands dir to have been called
    expect(mock.handler).toHaveBeenCalled();
  });

  it('falls back to the "<caller-dir>/commands" directory', async () => {
    const commandPath = path.join(__dirname, 'commands/foo');
    const { mock } = mockCommandModule(commandPath);

    await run({
      command: 'foo',
    });

    // Expect the handler from the fallback commands dir to have been called
    expect(mock.handler).toHaveBeenCalled();
  });

  it('imports commands from a custom commands directory', async () => {
    const commandsDir = 'custom-commands';

    // Mock the command module in the custom commands dir
    const { mock } = mockCommandModule(`${commandsDir}/foo`);

    // Run with the custom commands dir
    await run({
      command: 'foo',
      commandsDir,
    });

    // Expect the handler from the custom commands dir to have been called
    expect(mock.handler).toHaveBeenCalled();
  });

  it('initializes plugins with the correct context', async () => {
    mockCommandModule('commands/foo');

    // Run
    await run({
      command: 'foo',
      commandsDir: 'commands',
      plugins: [mockPlugin],
    });

    // Expect the plugin to have been initialized with the correct context
    expect(mockPlugin.init).toHaveBeenCalledWith(expect.any(Context));
    expect(mockPlugin.init).toHaveBeenCalledWith(
      expect.objectContaining({
        commandString: 'foo',
        commandsDir: 'commands',
        plugins: {
          [mockPlugin.name]: expect.objectContaining(mockPluginInfo),
        },
      } as Partial<Context>),
    );
  });

  it('passes data through the command chain', async () => {
    // Mock a few command modules
    mockCommandModules({
      'commands/foo': {
        handler: ({ next, data }) => next(data),
      },
      'commands/foo/bar': {
        handler: ({ next, data }) => next(data),
      },
      'commands/foo/bar/baz': {
        handler: ({ end, data }) => end(data),
      },
    });

    const initialData = 'hello, world!';

    // Run
    const result = await run({
      command: 'foo bar baz',
      commandsDir: 'commands',
      initialData,
    });

    // Expect the result to be the initial data
    expect(result).toBe(initialData);
  });

  it('returns the data from the last command in the chain', async () => {
    const dataFromBar = 'data from bar';

    // Mock a few command modules
    mockCommandModules({
      'commands/foo': {
        handler: ({ next }) => next('foo'),
      },
      'commands/foo/bar': {
        handler: ({ end }) => end(dataFromBar),
      },
    });

    // Run
    const result = await run({
      command: 'foo bar',
      commandsDir: 'commands',
      initialData: 'hello, world!',
    });

    // Expect the result to be the data from the last command
    expect(result).toBe(dataFromBar);
  });

  describe('lifecycle', () => {
    it('calls preParse hook with the correct payload', async () => {
      mockCommandModule('commands/foo');

      // Setup mock hook
      const mockHook = vi.fn(() => {});

      // Run
      await run({
        command: 'foo',
        commandsDir: 'commands',
        beforeParse: mockHook,
      });

      // Expect the hook to have been called with the correct payload
      expect(mockHook).toHaveBeenCalledWith({
        commandString: 'foo',
        optionsConfig: expect.any(Object),
        setParsedOptionsAndSkip: expect.any(Function),
        skip: expect.any(Function),
        setParseFn: expect.any(Function),
        context: expect.any(Context),
      } as HookPayload<'preParse'>);
    });

    it('calls postParse hook with the correct payload', async () => {
      mockCommandModule('commands/foo');

      // Setup mock hook
      const mockHook = vi.fn(() => {});

      // Run
      await run({
        command: 'foo',
        commandsDir: 'commands',
        afterParse: mockHook,
      });

      // Expect the hook to have been called with the correct payload
      expect(mockHook).toHaveBeenCalledWith({
        context: expect.any(Context),
        parsedOptions: expect.any(Object),
        setParsedOptions: expect.any(Function),
      } as HookPayload<'postParse'>);
    });

    it('calls preResolve hook with the correct payload', async () => {
      mockCommandModule('commands/foo');

      // Setup mock hook
      const mockHook = vi.fn(() => {});

      // Run
      await run({
        command: 'foo',
        commandsDir: 'commands',
        beforeResolve: mockHook,
      });

      // Expect the hook to have been called with the correct payload
      expect(mockHook).toHaveBeenCalledWith({
        commandString: 'foo',
        commandsDir: 'commands',
        setResolveFn: expect.any(Function),
        setParseFn: expect.any(Function),
        addResolvedCommands: expect.any(Function),
        skip: expect.any(Function),
        context: expect.any(Context),
      } as HookPayload<'preResolve'>);
    });

    it('calls postResolve hook with the correct payload', async () => {
      mockCommandModule('commands/foo');

      // Setup mock hook
      const mockHook = vi.fn(() => {});

      // Run
      await run({
        command: 'foo',
        commandsDir: 'commands',
        afterResolve: mockHook,
      });

      // Expect the hook to have been called with the correct payload
      expect(mockHook).toHaveBeenCalledWith({
        addResolvedCommands: expect.any(Function),
        context: expect.any(Context),
        resolvedCommands: expect.any(Array),
      } as HookPayload<'postResolve'>);
    });

    it('calls preExecute hook with the correct payload', async () => {
      mockCommandModule('commands/foo');

      // Setup mock hook
      const mockHook = vi.fn(() => {});

      // Run
      await run({
        command: 'foo',
        commandsDir: 'commands',
        beforeExecute: mockHook,
      });

      // Expect the hook to have been called with the correct payload
      expect(mockHook).toHaveBeenCalledWith({
        initialData: undefined,
        setInitialData: expect.any(Function),
        setResultAndSkip: expect.any(Function),
        skip: expect.any(Function),
        state: expect.any(State),
      } as HookPayload<'preExecute'>);
    });

    it('calls postExecute hook with the correct payload', async () => {
      mockCommandModule('commands/foo');

      // Setup mock hook
      const mockHook = vi.fn(() => {});

      // Run
      await run({
        command: 'foo',
        commandsDir: 'commands',
        afterExecute: mockHook,
      });

      // Expect the hook to have been called with the correct payload
      expect(mockHook).toHaveBeenCalledWith({
        result: undefined,
        setResult: expect.any(Function),
        state: expect.any(State),
      } as HookPayload<'postExecute'>);
    });

    it('calls preStateChange hook with the correct payload', async () => {
      mockCommandModule('commands/foo');

      // Setup mock hook
      const mockHook = vi.fn(() => {});

      // Run
      await run({
        command: 'foo',
        commandsDir: 'commands',
        plugins: [
          {
            name: 'test',
            version: '0.0.0',
            init: ({ hooks }) => {
              // Register the hook
              hooks.on('preStateChange', mockHook);

              return true;
            },
          },
        ],
      });

      // Expect the hook to have been called with the correct payload
      expect(mockHook).toHaveBeenCalledWith({
        changes: expect.any(Object),
        setChanges: expect.any(Function),
        skip: expect.any(Function),
        state: expect.any(State),
      } as HookPayload<'preStateChange'>);
    });

    it('calls postStateChange hook with the correct payload', async () => {
      mockCommandModule('commands/foo');

      // Setup mock hook
      const mockHook = vi.fn(() => {});

      // Run
      await run({
        command: 'foo',
        commandsDir: 'commands',
        plugins: [
          {
            name: 'test',
            version: '0.0.0',
            init: ({ hooks }) => {
              hooks.on('postStateChange', mockHook);
              return true;
            },
          },
        ],
      });

      // Expect the hook to have been called with the correct payload
      expect(mockHook).toHaveBeenCalledWith({
        changed: expect.any(Object),
        state: expect.any(State),
      } as HookPayload<'postStateChange'>);
    });

    it('calls preNext hook with the correct payload', async () => {
      mockCommandModules({
        'commands/foo': {
          handler: ({ next }) => next(),
        },
        'commands/foo/bar': {
          handler: ({ end }) => end(),
        },
      });

      // Setup mock hook
      const mockHook = vi.fn(() => {});

      // Run
      await run({
        command: 'foo bar',
        commandsDir: 'commands',
        beforeNext: mockHook,
      });

      // Expect the hook to have been called with the correct payload
      expect(mockHook).toHaveBeenCalledWith({
        data: undefined,
        nextCommand: expect.any(Object),
        setData: expect.any(Function),
        setNextCommand: expect.any(Function),
        state: expect.any(State),
      } as HookPayload<'preNext'>);
    });

    it('calls preEnd hook with the correct payload', async () => {
      mockCommandModule('commands/foo', {
        handler: ({ end }) => end(),
      });

      // Setup mock hook
      const mockHook = vi.fn(() => {});

      // Run
      await run({
        command: 'foo',
        commandsDir: 'commands',
        beforeEnd: mockHook,
      });

      // Expect the hook to have been called with the correct payload
      expect(mockHook).toHaveBeenCalledWith({
        data: undefined,
        setData: expect.any(Function),
        state: expect.any(State),
      } as HookPayload<'preEnd'>);
    });

    describe('error hook', () => {
      it('is called with the correct payload', async () => {
        mockCommandModule('commands/foo', {
          handler: () => {
            throw new ClideError('test');
          },
        });

        // Setup mock hook
        const mockHook = vi.fn(() => {});

        // Run
        await run({
          command: 'foo',
          commandsDir: 'commands',
          onError: mockHook,
        }).catch(() => {});

        // Expect the hook to have been called with the correct payload
        expect(mockHook).toHaveBeenCalledWith({
          context: expect.any(Context),
          error: expect.any(ClideError),
          ignore: expect.any(Function),
          setError: expect.any(Function),
        } as HookPayload<'error'>);
      });

      it('can set the error', async () => {
        const originalError = new Error('original error');
        const pluginError = new Error('plugin error');

        mockCommandModule('commands/foo', {
          handler: () => {
            throw originalError;
          },
        });

        // Create a plugin that sets the error
        const plugin: Plugin = {
          name: 'test',
          version: '0.0.0',
          init: ({ hooks }) => {
            hooks.on('error', ({ setError }) => {
              setError(pluginError);
            });

            return true;
          },
        };

        // Expect the command to throw the original error without the plugin
        expect(
          run({
            command: 'foo',
            commandsDir: 'commands',
          }),
        ).rejects.toThrowError(originalError);

        // Expect the command to throw the plugin error with the plugin
        expect(
          run({
            command: 'foo',
            commandsDir: 'commands',
            plugins: [plugin],
          }),
        ).rejects.toThrowError(pluginError);
      });

      it('can ignore the error', async () => {
        const originalError = new Error('original error');

        mockCommandModule('commands/foo', {
          handler: () => {
            throw originalError;
          },
        });

        // Create a plugin that sets the result
        const plugin: Plugin = {
          name: 'test',
          version: '0.0.0',
          init: ({ hooks }) => {
            hooks.on('error', ({ ignore }) => {
              ignore();
            });

            return true;
          },
        };

        expect(
          await run({
            command: 'foo',
            commandsDir: 'commands',
            plugins: [plugin],
          }),
        ).toBe(undefined);
      });
    });
  });
});
