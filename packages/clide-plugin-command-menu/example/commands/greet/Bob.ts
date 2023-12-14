import { command } from 'clide-js';

export default command({
  description: 'Greet Bob',
  handler: ({ context }) => {
    context.client.log('Hello Bob!');
  },
});
