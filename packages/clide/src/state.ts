import { ActionFactory } from './actions/action';
import { EndAction } from './actions/end';
import { NextAction } from './actions/next';
import { ResultAction } from './actions/result';
import { ClideClient } from './client';
import { ClideEmitter } from './emitter';
import { ClideCommandOptions, ClideCommandOptionsGetter } from './options';
import { ClideParams } from './resolver';
import { Tokens } from './parse';

export interface ClideState<
  TData = unknown,
  TParams extends ClideParams = ClideParams,
  TOptions extends ClideCommandOptions = ClideCommandOptions,
> {
  params: TParams;
  data: TData;
  tokens: Tokens;
  i: number;
  plugins: any[];
  client: ClideClient;
  emitter: ClideEmitter;

  // TODO:
  // - Validation
  // - Default values
  // - Type casting
  // - Prompting
  // - etc.
  options: ClideCommandOptionsGetter<TOptions>;

  result: ActionFactory<unknown, ResultAction>;
  next: ActionFactory<unknown, NextAction>;
  end: ActionFactory<unknown, EndAction>;
}
