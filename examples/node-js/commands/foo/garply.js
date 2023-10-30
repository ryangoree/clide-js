const { command } = require('clide-js');

module.exports = command({
  description: 'Sed mollis metus ac sapien viverra blandit nec in nibh.',
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
