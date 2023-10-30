import { run } from 'src/core/run';
import { help } from 'src/plugins/help';
import { logger } from 'src/plugins/logger';

const result = await run({
  plugins: [logger, help],
}).catch((e) => {
  console.error(e);
  process.exit(1);
});

console.log('result', result);
