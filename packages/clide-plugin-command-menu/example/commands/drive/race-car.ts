import { command } from 'clide-js';

export default command({
  description: 'Drive a race car',
  handler: ({ context, data }) => {
    context.client.log(`🏎️  Vroom vroom! (speed: ${data || 60}mph)`);
  },
});
