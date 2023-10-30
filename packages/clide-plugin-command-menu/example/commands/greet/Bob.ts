import { command } from 'clide';

export default command({
  description: 'Greet Bob',
  handler: ({ context }) => {
    context.client.log('Hello Bob!');
  },
});
