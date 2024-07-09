import { PartialSealed, StateSealed } from './sealed';

interface PromiseResponse<T> {
  response: T;
  responseTime: number;
}

interface PromiseState<S, V = any> extends StateSealed<V> {
  loading: () => V;
  success: (state: PromiseResponse<S>) => V;
  failure: (error: any) => V;
}

export class PromiseSealed<S, V = any> extends PartialSealed<
  V,
  PromiseResponse<S>,
  PromiseState<S, V>
> {
  public static loading(): PromiseSealed<any> {
    return new PromiseSealed('loading');
  }

  public static success<S>(value: PromiseResponse<S>): PromiseSealed<S> {
    return new PromiseSealed('success', value);
  }

  public static failure(error: any): PromiseSealed<any> {
    return new PromiseSealed('failure', error);
  }
}

type RxCallback<T> = (state: PromiseSealed<T>) => void;

class RxPromise {
  public static resolve<T>(promise: Promise<T>, callback: RxCallback<T>): void {
    callback(PromiseSealed.loading());

    const firstTime = Date.now();

    promise
      .then((response) => {
        callback(
          PromiseSealed.success({
            response,
            responseTime: Date.now() - firstTime
          })
        );
      })
      .catch((error) => {
        callback(PromiseSealed.failure(error));
      });
  }
}

export function rxPromise<T>(
  promise: Promise<T>,
  resolver: Partial<PromiseState<T>>
): void {
  RxPromise.resolve(promise, (state) => {
    state.when(resolver);
  });
}
