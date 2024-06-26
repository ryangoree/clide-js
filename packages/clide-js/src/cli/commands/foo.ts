import { command } from 'src/core/command';

export default command({
  description: 'Get a greeting',
  options: {
    name: {
      type: 'string',
      description: 'The name to greet',
      default: '0xff',
    },
  },
  handler: async ({ next, options }) => {
    const name = await options.name({
      prompt: 'Enter your name',
    });

    console.log(`Hello, ${name}!`);

    next(name);
  },
});
