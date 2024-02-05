import { command } from 'src/core/command';

export default command({
  description: 'Get a greeting',
  options: {
    name: {
      description: 'The name to greet',
      alias: ['n'],
      type: 'array',
      // default: 'World',
    },
    foo: {
      description: 'A foo option',
      type: 'array',
    },
  },
  handler: async ({ options, next }) => {
    let name = await options.name({
      validate: (value) => {
        console.log('value', value);
        console.log('typeof value', typeof value);
        return true;
      },
    });

    /**
     * string -> string
     * number -> number
     * array -> string
     * boolean -> boolean
     */

    console.log('name', name);

    if (!name) {
      const foo = await options.foo();
      console.log('foo', foo);
    }

    if (!name) {
      name = await options.name({
        prompt: 'What is your name?',
        validate: (value) => {
          console.log('value', value);
          console.log('typeof value', typeof value);
          return true;
        },
      });
    }

    next(`Hello, ${name}!`);
  },
});
