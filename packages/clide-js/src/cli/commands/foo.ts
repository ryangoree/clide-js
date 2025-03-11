import { command } from 'src/core/command';

export default command({
  handler: ({ next }) => next('foo'),
});
