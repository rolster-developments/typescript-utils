export type Observer<T> = (value: T) => void;

class RolsterObservable<T = any> {
  private observers: Observer<T>[] = [];

  private currentState: T;

  constructor(state: T) {
    this.currentState = state;
  }

  public subscribe(observer: Observer<T>): Unsubscription {
    this.observers.push(observer);

    observer(this.currentState);

    return () => {
      this.observers = this.observers.filter(
        (currentObserver) => currentObserver !== observer
      );
    };
  }

  public next(state: T): void {
    this.currentState = state;

    this.observers.forEach((observer) => {
      observer(state);
    });
  }
}

export type Observable<T> = RolsterObservable<T>;

export function observable<T>(state: T): RolsterObservable<T>;
export function observable<T>(): RolsterObservable<T | undefined>;
export function observable<T>(state?: T): RolsterObservable<T | undefined> {
  return new RolsterObservable(state);
}
