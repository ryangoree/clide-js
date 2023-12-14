import { run } from 'clide-js';
import { commandMenu } from '../src/command-menu.js';

run({
  plugins: [commandMenu({ title: 'Command Menu' })],
});
