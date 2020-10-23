export interface IListener<T> {
  (payload: T): void;
}

export interface IUnsubscribe {
  (): void;
}

export class TsEvent<T> {
  private listeners: Set<IListener<T>> = new Set();

  once(listener: IListener<T>): IUnsubscribe {
    this.listeners.add(listener);
    // bind the listener directly so it can still be this.removed
    const unsub1 = this.on(listener);
    // bind another listener to fire after it, that will remove it on firing
    const unsub2 = this.on(() => { unsub1(); unsub2(); })
    return unsub1;
  }

  on(listener: IListener<T>): IUnsubscribe {
    this.listeners.add(listener);
    return () => { this.remove(listener); };
  }

  remove(listener: IListener<T>) {
    this.listeners.delete(listener);
  }

  fire(payload: T) {
    this.listeners.forEach(lis => lis(payload));
  }
}