import { help, run } from 'clide-js';
import { commandMenu } from '../src/command-menu.js';

run({
  plugins: [
    help(),
    commandMenu({
      title: 'Command Menu',
      skip: (options) => !!options.help,
    }),
  ],
});
