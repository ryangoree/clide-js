import { command } from 'src/core/command';

export default command({
  handler: ({ end }) => end('data from bar'),
});
