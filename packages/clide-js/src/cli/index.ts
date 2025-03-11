#!/usr/bin/env node
import { run } from 'src/core/run';
// import { help } from 'src/plugins/help';

// await run({
//   plugins: [help({ maxWidth: 100 })],
//   defaultCommand: 'test',
// }).catch((e) => {
//   console.error(e);
//   process.exit(1);
// });

const result = await run({
  command: 'foo bar',
  // commandsDir: 'commands',
  initialData: 'hello, world!',
});

console.log(result);
