import { command } from 'src/core/command';

export default command({
  options: {
    a: {
      type: 'string',
      alias: ['A', 'a-alias'],
      nargs: 2,
      choices: ['a', 'b', 'c'],
    },
  },
  handler: async ({ options }) => {
    const a = await options.a();
    //    ^?
    console.log('a', a);

    const aAlias = await options.aAlias();
    //    ^?
    console.log('aAlias', aAlias);
  },
});
