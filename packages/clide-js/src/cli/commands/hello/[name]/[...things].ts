import { command } from 'src/core/command';

export default command({
  description: 'Prints a personalized greeting and compliment',
  handler: async ({ params, end }) => {
    await end(`Hello, ${params.name}! Nice ${params.things}!`);
  },
});
