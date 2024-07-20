export type Observer<T> = (value: T) => void;

class Observable<T = any> {
  private observers: Observer<T>[] = [];

  private currentState: T;

  constructor(state: T) {
    this.currentState = state;
  }

  public subscribe(observer: Observer<T>): Unsubscription {
    this.observers.push(observer);

    observer(this.currentState);

    return () => {
      this.observers.filter((currentObserver) => currentObserver !== observer);
    };
  }

  public next(state: T): void {
    this.observers.forEach((observer) => {
      observer(state);
    });
  }
}

export function observable<T>(state: T): Observable<T>;
export function observable<T>(): Observable<T | undefined>;
export function observable<T>(state?: T): Observable<T | undefined> {
  return new Observable(state);
}
