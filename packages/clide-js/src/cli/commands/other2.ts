import { command } from 'src/core/command';

export default command({
  options: {
    i2: {
      alias: ['input2'],
      type: 'number',
      required: true,
    },
  },
  handler: async ({ next, options }) => {
    const input = await options.input2();
    console.log(`other input2: ${input}`);
    next(input);
  },
});
