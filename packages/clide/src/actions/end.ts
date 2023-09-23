import { ClideCommandHandler } from 'src/command';
import { ClideError } from 'src/errors';
import { ClideState } from 'src/state';
import { Action } from './action';

export const EndSymbol = Symbol('end');
export type EndAction<TData = unknown> = Action<TData> & {
  [EndSymbol]: true;
};

export interface EndOptions {
  warning?: string;
  error?: string;
}

/**
 * Return data and end the steps.
 * @param data The data to return.
 *
 * @throws {ClideError} If an error is provided and the step is not the last.
 */
export function end<TData = unknown>(
  data?: TData,
  { warning, error }: EndOptions = {},
): EndAction {
  return {
    [EndSymbol]: true,
    data,
    async execute(steps: ClideCommandHandler[], state: ClideState) {
      state.data = data;
      state.emitter.emit('result', state);
      state.emitter.emit('end', state);

      if (steps[state.i + 1] && (warning || error)) {
        if (warning) {
          state.client.warn(warning);
        }
        if (error) {
          throw new ClideError(error);
        }

        // TODO: move to hook that can be enabled/disabled and only warns if
        // enabled and a warning or error aren't already set for the step.
        // state.client.warn(
        //   'Ending prematurely, remaining steps will be skipped.',
        // )
      }

      return data;
    },
  };
}
