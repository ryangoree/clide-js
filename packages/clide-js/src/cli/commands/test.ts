import { command } from 'src/core/command';

export default command({
  options: {
    a: {
      required: true,
      type: 'number',
    },
  },
  handler: async ({ options }) => {
    const a = await options.a({
      prompt: {
        message: 'Enter a',
        initial: 100,
      },
    });
    console.log(`Hello, ${a}!`);
  },
});
