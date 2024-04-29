import { formatFileName } from 'src/utils/format-file-name';
import { describe, expect, it } from 'vitest';

describe('format-file-name', () => {
  it('adds the .js extension', () => {
    expect(formatFileName('foo')).toBe('foo.js');
  });

  it('replaces non-.js extensions', () => {
    expect(formatFileName('foo.ts')).toBe('foo.js');
  });

  it('handles multiple file extensions', () => {
    expect(formatFileName('foo.test.ts.js.ts')).toBe('foo.test.ts.js.js');
  });

  it('handles multiple dots in a file name', () => {
    expect(formatFileName('[...foo].ts')).toBe('[...foo].js');
    expect(formatFileName('[...foo]')).toBe('[...foo].js');
    expect(formatFileName('foo..bar.ts')).toBe('foo..bar.js');
    expect(formatFileName('foo..bar')).toBe('foo..bar.js');
  });
});
