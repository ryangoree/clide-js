import { clide } from 'clide';
import { commandMenu } from '../src/command-menu.js';

clide({
  plugins: [commandMenu({ title: 'Command Menu' })],
});
