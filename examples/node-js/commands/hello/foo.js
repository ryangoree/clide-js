const { command } = require('clide-js');

module.exports = command({
  description: 'Say hello to foo',
  async handler({ context, end }) {
    context.client.log(`Hello Foo!`);
    end();
  },
});
