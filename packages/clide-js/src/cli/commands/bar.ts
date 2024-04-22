import { command } from 'src/core/command';
import foo from './foo';

export default command({
  description: 'Get a greeting',
  options: {
    name: {
      type: 'string',
      description: 'The name to greet',
    },
  },
  handler: async ({ next, options, fork }) => {
    const name = await options.name({
      prompt: 'Enter your name',
    });

    await fork({
      commands: [foo],
      optionValues: {
        name,
      },
    });

    next(name);
  },
});
