import { command } from 'src/core/command';

export default command({
  description: 'Get a greeting',
  handler: async ({ client }) => {
    const foo = await client.prompt({
      type: 'invisible',
      message: 'Enter a value',
    });
    console.log({
      foo,
      type: typeof foo,
    });
  },
});
