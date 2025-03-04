import { command } from 'src/core/command';

export default command({
  description: 'Get a greeting',

  options: {
    type: {
      type: 'string',
      description: 'The type of greeting',
      choices: ['hello', 'hi', 'hey'],
      required: true,
    },
    subject: {
      type: 'array',
      description: 'The thing to greet',
      choices: ['you', 'world', 'universe'],
      required: true,
    },
  },

  handler: async ({ options }) => {
    const type = await options.type();
    const subject = await options.subject();
    const subjectStr = subject.map((thing) => capitalize(thing)).join(' and ');
    console.log(`${capitalize(type)}, ${subjectStr}!`);
  },
});

function capitalize(str: string) {
  return `${str[0]?.toUpperCase()}${str.slice(1)}`;
}
