import EventEmitter from 'node:events';
import { ClideState } from './state';

export interface ClideEvents {
  result: (updatedState: ClideState) => void;
  next: (updatedState: ClideState) => void;
  end: (updatedState: ClideState) => void;
  err: (error: Error, state: ClideState) => void;
}

// TODO: Provide an implementation on top of EventEmitter that prevents emitter
// mutation without breaking the EventEmitter which needs to remain mutable.
export interface ClideEmitter extends Readonly<EventEmitter> {
  addListener<TEvent extends keyof ClideEvents>(
    eventName: TEvent,
    listener: ClideEvents[TEvent],
  ): this;

  on<TEvent extends keyof ClideEvents>(
    events: TEvent,
    handler: ClideEvents[TEvent],
  ): this;

  once<TEvent extends keyof ClideEvents>(
    eventName: TEvent,
    listener: ClideEvents[TEvent],
  ): this;

  removeListener<TEvent extends keyof ClideEvents>(
    eventName: TEvent,
    listener: ClideEvents[TEvent],
  ): this;

  off<TEvent extends keyof ClideEvents>(
    eventName: TEvent,
    listener: ClideEvents[TEvent],
  ): this;

  removeAllListeners<TEvent extends keyof ClideEvents>(
    eventName?: TEvent,
  ): this;

  listeners<TEvent extends keyof ClideEvents>(
    eventName: TEvent,
  ): ClideEvents[TEvent][];

  rawListeners<TEvent extends keyof ClideEvents>(
    eventName: TEvent,
  ): ClideEvents[TEvent][];

  emit<TEvent extends keyof ClideEvents>(
    events: TEvent,
    ...args: Parameters<ClideEvents[TEvent]>
  ): boolean;

  listenerCount<TEvent extends keyof ClideEvents>(eventName: TEvent): number;

  prependListener<TEvent extends keyof ClideEvents>(
    eventName: TEvent,
    listener: ClideEvents[TEvent],
  ): this;

  prependOnceListener<TEvent extends keyof ClideEvents>(
    eventName: TEvent,
    listener: ClideEvents[TEvent],
  ): this;

  eventNames(): (keyof ClideEvents)[];
}
