export interface RunOptions<T> {
  /**
   * Whether to suppress output.
   */
  quiet?: boolean;

  /**
   * A function to validate the result. Return false or an error message to fail the test.
   */
  validate?: (result: any, value: T) => boolean | string;

  /**
   * The number of milliseconds to wait between runs.
   */
  coolDown?: number;
}

export type RunArgs<T> = undefined extends T
  ? [number, T?, RunOptions<T>?]
  : [number, T, RunOptions<T>?];

export class Benchmark<T = any> {
  name: string;

  /**
   * The tests to be run.
   */
  tests: { name: string; fn: AnyFunction }[] = [];

  /**
   * The results of the tests.
   */
  results: { name: string; time: number; runs: number }[] | undefined;

  constructor(name = 'Benchmark') {
    this.name = name;
  }

  /**
   * Add a test to be run
   */
  test(name: string, fn: AnyFunction): this;
  test(fn: AnyFunction): this;
  test(name: string | AnyFunction, fn = name as AnyFunction): this {
    if (typeof name === 'function') {
      name = `Test ${this.tests.length + 1}`;
    }
    this.tests.push({ name, fn });
    return this;
  }

  /**
   * Preheat the runner by running the tests a number of times
   * @param iterations - The number of times to run each test
   * @param value - The value to pass to the test function
   */
  preHeat(iterations: number, value: any): Promise<this> {
    return this.run(iterations, value, { quiet: true });
  }

  /**
   * Run the tests.
   * @param iterations - The number of times to run each test.
   * @param value - The value to pass to the test function
   * @param options - Options for the run.
   */
  async run(
    ...[iterations = 1e5, value, { quiet, validate, coolDown } = {}]: RunArgs<T>
  ): Promise<this> {
    if (!quiet) {
      console.group(`${this.name}:`);
      console.log(`Running ${this.tests.length} tests ${iterations} times...`);
      if (value !== undefined) console.log('Value:', value);
    }

    if (globalThis.gc) {
      globalThis.gc();
    } else if (!quiet) {
      console.warn(yellow('No GC hook! Consider running with --expose-gc'));
    }

    const queue = this.tests.map((test) => ({
      ...test,
      runs: 0,
      time: 0,
    }));
    let totalTime = 0;
    this.results = queue.slice();

    while (queue.length) {
      const i = Math.floor(Math.random() * queue.length);
      const test = queue[i]!;
      const clonedValue = structuredClone(value);
      const runStart = performance.now();
      const result = await test.fn(clonedValue);
      const runTime = performance.now() - runStart;
      test.time += runTime;
      totalTime += runTime;
      if (++test.runs === iterations) queue.splice(i, 1);
      if (validate) {
        const validationResult =
          validate(result, clonedValue as T) || 'Validation failed';
        if (validationResult !== true) {
          console.log(red(`✖︎ ${test.name}: ${validationResult}`));
          console.groupEnd();
          break;
        }
      }
      if (coolDown) {
        await new Promise((resolve) => setTimeout(resolve, coolDown));
      }
    }

    if (!quiet) {
      const resultData = Object.fromEntries(
        this.results.map((test) => [
          test.name,
          {
            Runs: test.runs,
            'AVG Time (ms)': (test.time / iterations).toFixed(6),
            'Total Time (ms)': test.time.toFixed(6),
          },
        ]),
      );
      console.table(resultData);
      console.log(`Total time: ${totalTime} ms\n`);
      console.groupEnd();
    }

    return this;
  }
}

export function benchmark<T>(name = 'Benchmark') {
  return new Benchmark<T>(name);
}

// Internal //

/**
 * Make console text red.
 * @param {string[]} msg
 * @returns {string}
 */
function red(...msg: string[]) {
  return `\u001b[31m${msg.join(' ')}\u001b[0m`;
}

/**
 * Make console text yellow.
 * @param {string[]} msg
 * @returns {string}
 */
function yellow(...msg: string[]) {
  return `\u001b[33m${msg.join(' ')}\u001b[0m`;
}

/**
 * Make console text bold.
 * @param {string[]} msg
 * @returns {string}
 */
// function bold(...msg: string[]) {
//   return `\u001b[1m${msg.join(' ')}\u001b[0m`;
// }

type AnyFunction = (...args: any[]) => any | Promise<any>;
