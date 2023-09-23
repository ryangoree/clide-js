import path from 'node:path';
import { clide } from 'src/clide';
import { logger } from 'src/plugins/logger';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

async function main() {
  await clide({
    commandsDir: path.resolve(__dirname, './commands'),
    plugins: [logger],
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
