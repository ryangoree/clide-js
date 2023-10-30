import { command } from 'clide';

export default command({
  description: 'Drive a police cruiser',
  handler: ({ context, data }) => {
    context.client.log(`🚓 Vroom vroom! (speed: ${data || 60}mph)`);
  },
});
