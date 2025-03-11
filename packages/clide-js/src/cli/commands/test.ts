import { command } from 'src/core/command';
import other from './other';

export default command({
  options: {
    i: {
      alias: ['input'],
      type: 'string',
      // default: 'default input',
      default: ['default input', 'foo'],
      nargs: 2,
      // required: true,
    },
  },
  handler: async ({ options, fork }) => {
    const input = await options.input();
    console.log(`input: ${input} (${typeof input})`);
    await fork({
      commands: [other],
      optionValues: {
        input: 'foo',
      },
    });
  },
});
