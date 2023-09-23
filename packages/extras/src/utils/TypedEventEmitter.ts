import EventEmitter from 'node:events';

export interface ITypedEvents {
  [eventName: string | symbol]: (...args: any[]) => void;
}

interface IEventEmitterOverrides<TEvents extends ITypedEvents = ITypedEvents> {
  addListener<TEvent extends keyof TEvents>(
    eventName: TEvent,
    listener: TEvents[TEvent],
  ): ITypedEventEmitter<TEvents>;

  on<TEvent extends keyof TEvents>(
    events: TEvent,
    handler: TEvents[TEvent],
  ): ITypedEventEmitter<TEvents>;

  once<TEvent extends keyof TEvents>(
    eventName: TEvent,
    listener: TEvents[TEvent],
  ): ITypedEventEmitter<TEvents>;

  removeListener<TEvent extends keyof TEvents>(
    eventName: TEvent,
    listener: TEvents[TEvent],
  ): ITypedEventEmitter<TEvents>;

  off<TEvent extends keyof TEvents>(
    eventName: TEvent,
    listener: TEvents[TEvent],
  ): ITypedEventEmitter<TEvents>;

  removeAllListeners<TEvent extends keyof TEvents>(
    eventName?: TEvent,
  ): ITypedEventEmitter<TEvents>;

  listeners<TEvent extends keyof TEvents>(eventName: TEvent): TEvents[TEvent][];

  rawListeners<TEvent extends keyof TEvents>(
    eventName: TEvent,
  ): TEvents[TEvent][];

  emit<TEvent extends keyof TEvents>(
    events: TEvent,
    ...args: Parameters<TEvents[TEvent]>
  ): boolean;

  listenerCount<TEvent extends keyof TEvents>(eventName: TEvent): number;

  prependListener<TEvent extends keyof TEvents>(
    eventName: TEvent,
    listener: TEvents[TEvent],
  ): ITypedEventEmitter<TEvents>;

  prependOnceListener<TEvent extends keyof TEvents>(
    eventName: TEvent,
    listener: TEvents[TEvent],
  ): ITypedEventEmitter<TEvents>;

  eventNames(): (keyof TEvents)[];
}

export interface ITypedEventEmitter<TEvents extends ITypedEvents = ITypedEvents>
  extends Omit<EventEmitter, keyof IEventEmitterOverrides>,
    IEventEmitterOverrides<TEvents> {}
