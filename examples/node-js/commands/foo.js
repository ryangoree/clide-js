const { command, ClideError } = require('clide-js');

module.exports = command({
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  handler: () => {
    throw new ClideError(
      new Error('This is an error message', {
        cause: new Error('This is the cause of the error'),
      }),
    );
  },
});
