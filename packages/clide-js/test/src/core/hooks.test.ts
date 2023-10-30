import { HooksEmitter } from 'src/core/hooks';
import { describe, expect, it, vi } from 'vitest';

describe('hooks emitter', () => {
  it('calls registered hooks', async () => {
    const hooks = new HooksEmitter();
    const hook = vi.fn();

    hooks.on('test', hook);
    hooks.call('test', 'foo', 'bar');

    expect(hook).toHaveBeenCalledWith('foo', 'bar');
  });

  it('calls registered hooks in order', async () => {
    const hooks = new HooksEmitter();

    let data = '';

    hooks.on('test', () => {
      data += 'a';
    });
    hooks.on('test', () => {
      data += 'b';
    });

    await hooks.call('test');

    expect(data).toBe('ab');
  });

  it("doesn't call unregistered hooks", async () => {
    const hooks = new HooksEmitter();
    const hook = vi.fn();

    hooks.on('test', hook);
    hooks.call('test');

    hooks.off('test', hook);
    hooks.call('test');

    expect(hook).toHaveBeenCalledTimes(1);
  });

  it('calls once hooks only once', async () => {
    const hooks = new HooksEmitter();
    const hook = vi.fn();

    hooks.once('test', hook);
    hooks.call('test');
    hooks.call('test');

    expect(hook).toHaveBeenCalledTimes(1);
  });
});
