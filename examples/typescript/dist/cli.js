import { help, run } from 'clide-js';
import { commandMenu } from 'clide-plugin-command-menu';
const result = await run({
  plugins: [
    help(),
    commandMenu({
      title: 'Foo CLI',
      titleColors: ['#D89DFF', '#519BFF'],
    }),
  ],
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
console.log(result);
