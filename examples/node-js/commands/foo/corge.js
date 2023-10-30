const { command } = require('clide-js');

module.exports = command({
  description: 'Donec arcu turpis, interdum at porta in, posuere in sapien.',
  options: {
    name: {
      type: 'string',
      description: 'Name to say hello to',
      alias: ['n'],
      default: 'World',
    },
  },
  async handler({ context, options, next }) {
    const name = options.values.name;
    context.client.log(`Hello ${name}!`);
    next();
  },
});
