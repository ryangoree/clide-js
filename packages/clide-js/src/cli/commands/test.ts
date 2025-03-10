import { command } from 'src/core/command';
import other from './other';

export default command({
  options: {
    i: {
      alias: ['input'],
      type: 'string',
      default: 'default input',
      required: true,
      nargs: 2,
    },
  },
  handler: async ({ options, fork }) => {
    const input = await options.input();
    console.log(`input: ${input}`);
    await fork({
      commands: [other],
      optionValues: {
        input: 'foo',
      },
    });
  },
});
