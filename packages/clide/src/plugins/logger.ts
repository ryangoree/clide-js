import { ClidePlugin } from 'src/plugins';

export const logger: ClidePlugin = {
  meta: {
    name: 'logger',
    version: '0.0.0',
    description: 'Logs the result of each execution step.',
  },
  init: ({ emitter, client, options }) => {
    client.log(`[🪵 ${new Date().toISOString()}] options:`, options);
    emitter.on('result', ({ tokens, i, data, params }) => {
      client.log(`[🪵 ${new Date().toISOString()}] result:`, {
        token: tokens[i],
        data,
        params,
      });
    });
  },
};
