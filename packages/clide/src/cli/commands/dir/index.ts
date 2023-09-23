import { command } from 'src/command';

export default command({
  description: 'Can you see me?',
  handler: ({ end }) => end('Yes, I can see you!'),
});
