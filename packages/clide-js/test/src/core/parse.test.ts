import { ParsedCommand, parseCommand } from 'src/core/parse';
import { unmockAllCommandModules } from 'test/mocks/command-modules';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('parse', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    unmockAllCommandModules();
  });

  it('parses basic command tokens and options', async () => {
    const commandString =
      'foo bar -a -b=bval -c="cval1 cval2" -d dval -e "eval1 eval2" --f-word --g-word=gval --h-word="hval1 hval2" --i-word ival --j-word "jval1 jval2"';

    expect(
      await parseCommand(commandString, {
        a: { type: 'boolean' },
        b: { type: 'string' },
        c: { type: 'string' },
        d: { type: 'string' },
        e: { type: 'string' },
        'f-word': { type: 'boolean' },
        'g-word': { type: 'string' },
        'h-word': { type: 'string' },
        'i-word': { type: 'string' },
        'j-word': { type: 'string' },
      }),
    ).toMatchObject({
      tokens: ['foo', 'bar'],
      options: {
        a: true,
        b: 'bval',
        c: 'cval1 cval2',
        d: 'dval',
        e: 'eval1 eval2',
        'f-word': true,
        'g-word': 'gval',
        'h-word': 'hval1 hval2',
        'i-word': 'ival',
        'j-word': 'jval1 jval2',
      },
    } as ParsedCommand);
  });

  it('parses array options', async () => {
    const commandString = 'foo -a=one two three -b do re mi';

    expect(
      await parseCommand(commandString, {
        a: { type: 'array' },
        b: { type: 'array' },
      }),
    ).toMatchObject({
      tokens: ['foo'],
      options: {
        a: ['one', 'two', 'three'],
        b: ['do', 're', 'mi'],
      },
    } as ParsedCommand);
  });

  it("doesn't parse unknown options", async () => {
    const commandString = 'foo -a -b -c';

    expect(
      await parseCommand(commandString, {
        a: { type: 'boolean' },
      }),
    ).toMatchObject({
      tokens: ['foo', '-b', '-c'],
      options: {
        a: true,
      },
    } as ParsedCommand);
  });
});
