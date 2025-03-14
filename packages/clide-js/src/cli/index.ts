#!/usr/bin/env node
import { run } from 'src/core/run';
import { help } from 'src/plugins/help';
import { logger } from 'src/plugins/logger';

const result = await run({
  plugins: [
    logger({
      enabled: process.env.NODE_ENV === 'development',
    }),
    help(),
  ],
  defaultCommand: 'test',
}).catch((e) => {
  console.error(e);
  process.exit(1);
});

console.log('result:', result);
