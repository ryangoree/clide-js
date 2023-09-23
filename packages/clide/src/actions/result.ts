import { ClideCommandHandler } from 'src/command';
import { ClideState } from 'src/state';
import { Action } from './action';

export const ResultSymbol = Symbol('result');
export type ResultAction<TData = unknown> = Action<TData> & {
  [ResultSymbol]: true;
};

/**
 * Modify the data and continue to the next step if there is one, otherwise
 * return the data.
 * @param data The data to pass to the next step or return.
 */
export function result<TData = unknown>(data?: TData): ResultAction {
  return {
    [ResultSymbol]: true,
    data,
    async execute(steps: ClideCommandHandler[], state: ClideState) {
      state.data = data;
      state.emitter.emit('result', state);
      const nextHandler = steps[state.i + 1];
      if (nextHandler) {
        state.i++;
        return await nextHandler(state);
      }
      return state.data;
    },
  };
}
