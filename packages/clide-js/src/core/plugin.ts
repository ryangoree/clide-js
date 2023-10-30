import { MaybePromise } from 'src/utils/types';
import { Context } from './context';

/**
 * Metadata about a plugin.
 * @catgory Core
 * @group Plugin
 */
export interface PluginInfo {
  /** The name of the plugin. */
  name: string;
  /** The version of the plugin. */
  version: string;
  /** A description of the plugin. */
  description?: string;
  /**
   * Any additional metadata about the plugin. This is useful for plugins that
   * need to provide additional data to other plugins or commands.
   */
  meta?: {
    [key: string]: any;
  };
}

/**
 * A Clide-JS plugin
 * @group Plugin
 */
export interface Plugin extends PluginInfo {
  /**
   * Initialize the plugin.
   * @param context - The context the plugin is being initialized in.
   * @returns A boolean or promise that resolves to a boolean indicating
   * whether the plugin was successfully initialized.
   */
  init: (context: Context) => MaybePromise<boolean>;
}
