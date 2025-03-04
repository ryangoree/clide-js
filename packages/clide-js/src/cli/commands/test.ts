import { command } from 'src/core/command';

export default command({
  options: {
    i: {
      alias: ['input'],
      type: 'string',
      description: 'Input string',
      required: true,
    },
  },
  handler: async ({ options }) => {
    const input = await options.input();
    console.log('input:', input);
  },
});
