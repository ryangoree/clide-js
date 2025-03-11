import { command } from 'src/core/command';

export default command({
  options: {
    n: {
      alias: ['name'],
      required: true,
      type: 'string',
    },
  },
  handler: async ({ options }) => {
    const name = await options.name();
    console.log(`Hello, ${name}!`);
  },
});
