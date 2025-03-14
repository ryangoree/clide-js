import { parseFileName } from 'src/utils/filename';
import { describe, expect, it } from 'vitest';

describe('parse-file-name', () => {
  it('parses param file name', () => {
    // basic
    expect(parseFileName('[param]')).toEqual({
      spreadOperator: undefined,
      paramName: 'param',
      extension: undefined,
    });

    // with extension
    expect(parseFileName('[param].ts')).toEqual({
      spreadOperator: undefined,
      paramName: 'param',
      extension: '.ts',
    });

    // capital letters
    expect(parseFileName('[PARAM].ts')).toEqual({
      spreadOperator: undefined,
      paramName: 'PARAM',
      extension: '.ts',
    });

    // with underscores
    expect(parseFileName('[_p_r_m].ts')).toEqual({
      spreadOperator: undefined,
      paramName: '_p_r_m',
      extension: '.ts',
    });

    // with hyphens (not as first character)
    expect(parseFileName('[p-r-m].ts')).toEqual({
      spreadOperator: undefined,
      paramName: 'p-r-m',
      extension: '.ts',
    });

    // with numbers (not as first character)
    expect(parseFileName('[param123].ts')).toEqual({
      spreadOperator: undefined,
      paramName: 'param123',
      extension: '.ts',
    });
  });

  it('parses param file name with spread operator', () => {
    expect(parseFileName('[...param]')).toEqual({
      spreadOperator: '...',
      paramName: 'param',
      extension: undefined,
    });

    expect(parseFileName('[...param].ts')).toEqual({
      spreadOperator: '...',
      paramName: 'param',
      extension: '.ts',
    });
  });

  it('returns undefined values for non-param file name', () => {
    const expected = {
      spreadOperator: undefined,
      paramName: undefined,
      extension: undefined,
    };

    // plain string
    expect(parseFileName('param')).toEqual(expected);

    // basic file name
    expect(parseFileName('param.ts')).toEqual(expected);

    // with double extension
    expect(parseFileName('[param].old.ts')).toEqual(expected);

    // starts with hyphen
    expect(parseFileName('[-param].ts')).toEqual(expected);

    // starts with number
    expect(parseFileName('[2param].ts')).toEqual(expected);

    // includes special characters
    expect(parseFileName('[p@ram].ts')).toEqual(expected);

    // wrong number of dots for spread operator (= includes special characters)
    expect(parseFileName('[.param].ts')).toEqual(expected);
    expect(parseFileName('[..param].ts')).toEqual(expected);
    expect(parseFileName('[....param].ts')).toEqual(expected);

    // missing opening or closing bracket
    expect(parseFileName('param].ts')).toEqual(expected);
    expect(parseFileName('[param.ts')).toEqual(expected);
  });
});
