import { clide } from 'clide';
import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

clide({
  commandsDir: path.resolve(__dirname, './commands'),
});
