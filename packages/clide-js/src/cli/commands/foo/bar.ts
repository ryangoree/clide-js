import { command } from 'src/core/command';

export default command({
  description: 'Get a greeting',
  options: {
    name: {
      type: 'string',
      description: 'The name to greet',
    },
  },
  handler: async ({ options }) => {
    console.log(options);
  },
});
