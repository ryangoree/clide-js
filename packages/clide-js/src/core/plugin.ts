import { MaybePromise, Nothing, Prettify } from 'src/utils/types';
import { Context } from './context';

/**
 * A Clide-JS plugin
 * @group Plugin
 */
export type Plugin<TMeta extends Meta = any> = Prettify<
  PluginInfo<TMeta> & {
    /**
     * Initialize the plugin.
     * @param context - The context the plugin is being initialized in.
     * @returns A boolean or promise that resolves to a boolean indicating
     * whether the plugin was successfully initialized.
     */
    init: (context: Context) => MaybePromise<boolean>;
  }
>;

/**
 * Information about a plugin.
 * @catgory Core
 * @group Plugin
 */
export type PluginInfo<TMeta extends Meta> = Prettify<
  {
    name: string;
    version: string;
    description?: string;
  } & (unknown extends TMeta
    ? {
        /**
         * Additional metadata about the plugin that doesn't fit in the standard
         * fields.
         *
         * Note: Plugin info on the {@linkcode Context} object will be frozen after
         * the plugin is initialized. Use this field to store mutable metadata that
         * can be updated during the plugin's lifecycle.
         */
        meta?: Record<string, any>;
      }
    : {
        /**
         * Additional metadata about the plugin that doesn't fit in the standard
         * fields.
         *
         * Note: Plugin info on the {@linkcode Context} object will be frozen after
         * the plugin is initialized. Use this field to store mutable metadata that
         * can be updated during the plugin's lifecycle.
         */
        meta: TMeta;
      })
>;

type Meta = Record<string, any> | Nothing;
