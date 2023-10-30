import { command } from 'src/core/command';

export default command({
  description: 'Prints a greeting to Alice',
  handler: async ({ next }) => {
    next(`Hello, Alice!`);
  },
});
