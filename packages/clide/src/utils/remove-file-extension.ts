/**
 * Removes the file extension from a string.
 * 
 * @example
 * removeFileExtension('foo.txt') // 'foo'
 */
export function removeFileExtension(str: string): string {
  return str.replace(/\.[^.]+$/, '');
}
