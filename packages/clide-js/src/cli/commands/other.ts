import { command } from 'src/core/command';

export default command({
  options: {
    i: {
      alias: ['input'],
      type: 'string',
      // required: true,
    },
  },
  handler: async ({ next, options }) => {
    const fromGet = await options.get('input', 'i');
    console.log('opts from get:', fromGet);
    const input = await options.input();
    console.log(`other input: ${input}`);
    next(input);
  },
});
