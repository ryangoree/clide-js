import { ClideCommandHandler } from 'src/command';
import { ClideState } from 'src/state';

export interface Action<TData = unknown> {
  data: TData;
  execute: (
    steps: ClideCommandHandler[],
    state: ClideState,
  ) => Promise<Action | TData>;
}

export type ActionFactory<
  TData = unknown,
  TAction extends Action<TData> = Action<TData>,
> = (data?: TData) => TAction;
