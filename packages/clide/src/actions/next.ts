import { ClideCommandHandler } from 'src/command';
import { ClideError } from 'src/errors';
import { ClideState } from 'src/state';
import { Action } from './action';

export const NextSymbol = Symbol('next');
export type NextAction<TData = unknown> = Action<TData> & {
  [NextSymbol]: true;
};

/**
 * Modify the data and continue to the next step if there is one, otherwise
 * throw an error.
 * @param data The data to pass to the next step.
 *
 * @throws {ClideError} If there is no next step.
 */
export function next<TData = unknown>(data?: TData): NextAction {
  return {
    [NextSymbol]: true,
    data,
    async execute(steps: ClideCommandHandler[], state: ClideState) {
      state.data = data;
      const nextHandler = steps[state.i + 1];
      if (!nextHandler) {
        const error = new Error(
          `Subcommand required for command path "${state.tokens.join(' ')}".`,
        );
        state.emitter.emit('err', error, state);
        throw new ClideError(error);
      }
      state.emitter.emit('result', state);
      state.emitter.emit('next', state);
      state.i++;
      return await nextHandler(state);
    },
  };
}
