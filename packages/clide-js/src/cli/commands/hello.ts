import { command } from 'src/core/command';

export default command({
  description: 'Get a greeting',
  options: {
    name: {
      description: 'The name to greet',
      alias: ['n'],
      type: 'string',
      default: 'World',
    },
  },
  requiresSubcommand: true,
  handler: async ({ options, next }) => {
    const name = await options.name({
      prompt: "What's your name?",
    });

    next(`Hello, ${name}!`);
  },
});
