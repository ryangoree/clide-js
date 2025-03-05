import { command } from 'src/core/command';

export default command({
  options: {
    i: {
      alias: ['input'],
      type: 'string',
      required: true,
    },
  },
  handler: async ({ next, options }) => {
    const input = await options.input();
    console.log(`other input: ${input}`);
    next(input);
  },
});
