// Must be imported first
import {
  mockCommandModule,
  mockCommandModules,
  unmockAllCommandModules,
} from 'test/utils/command-modules';

import path from 'node:path';
import { Client } from 'src/core/client';
import { Context } from 'src/core/context';
import { ClideError } from 'src/core/errors';
import type { HookPayload } from 'src/core/hooks';
import type { Plugin } from 'src/core/plugin';
import { run } from 'src/core/run';
import { State } from 'src/core/state';
import { mockPlugin, mockPluginInfo } from 'test/utils/plugin';
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

  it('ends the command chain when "end()" is called', async () => {
    const dataFromBar = 'data from bar';
    mockCommandModules({
      'commands/foo': {
        handler: ({ next }) => next('foo'),
      },
      'commands/foo/bar': {
        handler: ({ end }) => end(dataFromBar),
      },
      'commands/foo/bar/baz': {
        handler: ({ end }) => end('baz'),
      },
    });

    // Run
    const result = await run({
      command: 'foo bar baz',
      commandsDir: 'commands',
      initialData: 'hello, world!',
    });

    // Expect the result to be the data from the last command
    expect(result).toBe(dataFromBar);
  });

  it('handles commands that call an action without awaiting', async () => {
    const endData = 'end data';
    mockCommandModules({
      'commands/foo': {
        // Not awaited
        handler: ({ next }) => {
          next('not awaited');
        },
      },
      'commands/foo/bar': {
        // Doesn't resolve right away
        handler: ({ end }) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              end(endData);
              resolve(undefined);
            }, 100);
          });
        },
      },
    });

    // Run
    const result = await run({
      command: 'foo bar',
      commandsDir: 'commands',
    });

    // Should still get the data from the last command
    expect(result).toBe(endData);
  });

  it("handles commands that don't call an action", async () => {
    const endData = 'end data';
    mockCommandModules({
      'commands/foo': {
        // No action
        handler: () => {},
      },
      'commands/foo/bar': {
        // Doesn't resolve right away
        handler: ({ end }) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              end(endData);
              resolve(undefined);
            }, 100);
          });
        },
      },
    });

    // Run
    const result = await run({
      command: 'foo bar',
      commandsDir: 'commands',
    });

    // Should still get the data from the last command
    expect(result).toBe(endData);
  });

  describe('lifecycle', () => {
    it('calls beforeParse hook with the correct payload', async () => {
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
      } as HookPayload<'beforeParse'>);
    });

    it('calls afterParse hook with the correct payload', async () => {
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
      } as HookPayload<'afterParse'>);
    });

    it('calls beforeResolve hook with the correct payload', async () => {
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
      } as HookPayload<'beforeResolve'>);
    });

    it('calls afterResolve hook with the correct payload', async () => {
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
      } as HookPayload<'afterResolve'>);
    });

    it('calls beforeExecute hook with the correct payload', async () => {
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
      } as HookPayload<'beforeExecute'>);
    });

    it('calls afterExecute hook with the correct payload', async () => {
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
      } as HookPayload<'afterExecute'>);
    });

    it('calls beforeStateChange hook with the correct payload', async () => {
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
              hooks.on('beforeStateChange', mockHook);

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
      } as HookPayload<'beforeStateChange'>);
    });

    it('calls afterStateChange hook with the correct payload', async () => {
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
              hooks.on('afterStateChange', mockHook);
              return true;
            },
          },
        ],
      });

      // Expect the hook to have been called with the correct payload
      expect(mockHook).toHaveBeenCalledWith({
        changes: expect.any(Object),
        state: expect.any(State),
      } as HookPayload<'afterStateChange'>);
    });

    it('calls beforeNext hook with the correct payload', async () => {
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
      } as HookPayload<'beforeNext'>);
    });

    it('calls beforeEnd hook with the correct payload', async () => {
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
      } as HookPayload<'beforeEnd'>);
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

        const withoutPlugin = (await run({
          command: 'foo',
          commandsDir: 'commands',
        }).catch((e) => e)) as ClideError;

        const withPlugin = (await run({
          command: 'foo',
          commandsDir: 'commands',
          plugins: [plugin],
        }).catch((e) => e)) as ClideError;

        expect(withoutPlugin.message).toBe(originalError.message);
        expect(withPlugin.message).toBe(pluginError.message);
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

    describe('exit hook', () => {
      const data = 'test data';
      it('can cancel the exit', async () => {
        mockCommandModules({
          'commands/foo': {
            handler: ({ context }) => {
              context.exit();
            },
          },
          'commands/foo/bar': {
            handler: ({ end }) => {
              console.log('end', end);
              end(data);
            },
          },
        });

        // Run and expect
        const result = await run({
          command: 'foo bar',
          commandsDir: 'commands',
          onExit: ({ cancel }) => {
            console.log('cancel', cancel);
            cancel();
          },
        });

        // Expect the result to be the data from the last command
        expect(result).toBe(data);
      });

      it('is called with the correct payload', async () => {
        const code = 1;
        const message = 'test';
        mockCommandModule('commands/foo', {
          handler: ({ context }) => {
            context.exit(code, message);
          },
        });

        // Setup mock hook
        const mockHook = vi.fn(({ cancel }) => {
          cancel();
        });

        // Run
        await run({
          command: 'foo',
          commandsDir: 'commands',
          onExit: mockHook,
        }).catch(() => {});

        // Expect the hook to have been called with the correct payload
        expect(mockHook).toHaveBeenCalledWith({
          context: expect.any(Context),
          code,
          setCode: expect.any(Function),
          message,
          setMessage: expect.any(Function),
          cancel: expect.any(Function),
        } as HookPayload<'exit'>);
      });

      it('can set the exit code', async () => {
        const originalCode = 1;
        const hookCode = 2;

        const exitSpy = vi
          .spyOn(process, 'exit')
          .mockImplementation((() => {}) as any);

        mockCommandModule('commands/foo', {
          handler: ({ context }) => {
            context.exit(originalCode);
          },
        });

        // Expect the command to throw the original error without the plugin
        await run({
          command: 'foo',
          commandsDir: 'commands',
          onExit: ({ setCode }) => {
            setCode(hookCode);
          },
        });

        expect(exitSpy).toHaveBeenCalledWith(hookCode);
      });

      it('can set the message', async () => {
        const originalMessage = 'original message';
        const hookMessage = 'hook message';

        mockCommandModule('commands/foo', {
          handler: ({ context }) => {
            context.exit(1, originalMessage);
          },
        });

        // Spy on the client's error method
        const clientLogSpy = vi.spyOn(Client.prototype, 'error');

        // Prevent the process from exiting
        vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);

        // Expect the command to throw the original error without the plugin
        await run({
          command: 'foo',
          commandsDir: 'commands',
          onExit: ({ setMessage }) => {
            setMessage(hookMessage);
          },
        });

        // Expect the message from the hook to have been used
        expect(clientLogSpy).toHaveBeenCalledWith(hookMessage);
      });
    });
  });
});
