import type { Context } from 'src/core/context';
import type { Plugin, PluginInfo } from 'src/core/plugin';
import { vi } from 'vitest';

export const mockPluginInfo: PluginInfo = {
  name: 'mock-plugin',
  version: '0.0.0',
};

export const mockPlugin: Plugin = {
  ...mockPluginInfo,
  init: vi.fn(() => true),
};

export const notReadyMockPlugin: Context['plugins']['mock-plugin'] = {
  ...mockPluginInfo,
  isReady: false,
};

export const readyMockPlugin: Context['plugins']['mock-plugin'] = {
  ...mockPluginInfo,
  isReady: true,
};
