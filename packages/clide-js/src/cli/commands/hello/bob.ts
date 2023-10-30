import { command } from 'src/core/command';

export default command({
  description: 'Prints a greeting to Bob',
  handler: async ({ next }) => {
    next(`Hello, Bob!`);
  },
});
