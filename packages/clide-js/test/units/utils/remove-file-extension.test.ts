import { removeFileExtension } from 'src/utils/filename';
import { describe, expect, it } from 'vitest';

describe('remove-file-extension', () => {
  it('removes the file extension from a string', () => {
    expect(removeFileExtension('foo.ts')).toBe('foo');
  });

  it('leaves a string without a file extension unchanged', () => {
    expect(removeFileExtension('foo')).toBe('foo');
  });

  it('only removes the last file extension from a string with multiple file extensions', () => {
    expect(removeFileExtension('foo.test.ts')).toBe('foo.test');
  });

  it('ignores multiple dots in a file name', () => {
    expect(removeFileExtension('[...foo].ts')).toBe('[...foo]');
    expect(removeFileExtension('[...foo]')).toBe('[...foo]');
    expect(removeFileExtension('foo..bar')).toBe('foo..bar');
  });
});
