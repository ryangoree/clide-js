import { command } from 'clide';

export default command({
  description: 'Greet Alice',
  handler: ({ context }) => {
    context.client.log('Hello Alice!');
  },
});
