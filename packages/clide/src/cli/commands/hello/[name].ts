import { command } from 'src/command';

export default command({
  description: 'Prints a personalized greeting',
  options: {
    a: {
      type: 'array',
      alias: ['aka'],
      description: 'Your nickname',
    },
  },
  handler: async ({ result, options, params }) => {

    const aka = await options.aka({
      prompt: {
        message: 'What is your nickname?',
      },
    })

    return result(`Hello, ${aka || params.name}!`);
  },
});
