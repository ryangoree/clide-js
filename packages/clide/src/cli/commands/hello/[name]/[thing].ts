import { command } from 'src/command';

export default command({
  description: 'Prints a personalized greeting and compliment',
  handler: ({ params, end }) =>
    end(`Hello, ${params.name}! Nice ${params.thing}!`),
});
