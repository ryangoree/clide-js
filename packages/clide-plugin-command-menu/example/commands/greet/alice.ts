import { command } from 'clide-js';

export default command({
  description: 'Greet Alice',
  handler: ({ context }) => {
    context.client.log('Hello Alice!');
  },
});
