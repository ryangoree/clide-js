import { command } from 'src/core/command';
import otherCommand from './other';

export default command({
  options: {
    i: {
      alias: ['input'],
      type: 'string',
      required: true,
    },
  },
  handler: async ({ next, options, fork }) => {
    const input = await options.input();
    console.log(`test input: ${input}`);

    const forkResult = await fork({
      commands: [otherCommand],
      optionValues: {
        i: `forked ${input}`,
        // input: `forked ${input}`,
      },
    });
    console.log('fork result:', forkResult);

    next(forkResult);
  },
});
