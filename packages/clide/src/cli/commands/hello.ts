import { command } from 'src/command';

export default command({
  description: 'Prints a greeting',
  options: {
    name: {
      description: 'The name to greet',
      type: 'string',
      alias: ['n'],
      default: 'World',
    },
  },
  handler: async ({ result, options }) => {
    const name = await options.name();
    return result(`Hello, ${name}!`);
  },
});
