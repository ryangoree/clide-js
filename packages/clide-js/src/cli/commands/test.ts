import { command } from 'src/core/command';

export default command({
  options: {
    name: {
      required: true,
      type: 'string',
    },
  },
  handler: async ({ options }) => {
    const name = await options.name();

    console.log(`Hello, ${name}!`);
  },
});
