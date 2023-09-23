import { command } from 'clide';
import path from 'node:path';

export default command({
  description: 'Runs test files',
  options: {
    n: {
      description: 'Number of times to run each test',
      type: 'number',
      alias: ['num'],
      default: 100_000,
    },
  },
  handler: async function ({ params, end, options }) {
    const number = await options.num();
    for (const testPath of params.paths as string[]) {
      const { default: handler } = await import(
        path.join(process.cwd(), testPath)
      );
      perf(path.basename(testPath), handler, number);
    }
    return end();
  },
});

export function perf(name: string, fn: (...args: any[]) => any, n = 1): void {
  console.time(name);
  for (let i = 0; i < n; i++) {
    fn();
  }
  console.timeEnd(name);
}
