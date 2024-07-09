type PromisesFn<T extends any> = () => Promise<T>;

type PromisesProps<T extends any> = {
  error: (error: any) => void;
  index: number;
  promises: PromisesFn<T>[];
  result: T[];
  success: (results: T[]) => void;
};

function resolvePromises<T extends any>(props: PromisesProps<T>): void {
  const { error, index, promises, result, success } = props;

  if (index === promises.length) {
    return success(result);
  }

  const callback = promises[index];

  new Promise(() => {
    callback()
      .then((value) =>
        resolvePromises({
          ...props,
          index: index + 1,
          result: [...result, value]
        })
      )
      .catch((err) => error(err));
  });
}

export function fromPromise<M>(value: M | Promise<M>): Promise<M> {
  return value instanceof Promise ? value : Promise.resolve(value);
}

export function zipPromise<T = any>(promises: PromisesFn<T>[]): Promise<T[]> {
  return promises.length
    ? new Promise((resolve, reject) => {
        resolvePromises({
          error: (err) => {
            reject(err);
          },
          index: 0,
          result: [],
          promises,
          success: (result) => {
            resolve(result);
          }
        });
      })
    : Promise.resolve([]);
}

export function thenPromise<T>(
  promise: Promise<T>,
  printError = false
): Promise<void> {
  return promise
    .then(() => undefined)
    .catch((err) => {
      /* istanbul ignore if */
      if (printError) {
        console.log(err);
      }

      throw err;
    });
}

export function voidPromise<T>(
  promise: Promise<T>,
  printError = false
): Promise<void> {
  return promise
    .then(() => undefined)
    .catch((err) => {
      /* istanbul ignore if */
      if (printError) {
        console.log(err);
      }

      return undefined;
    });
}

export function catchPromise<T>(
  promise: Promise<T>,
  printError = false
): Promise<Undefined<T>> {
  return promise.catch((err) => {
    /* istanbul ignore if */
    if (printError) {
      console.log(err);
    }

    return undefined;
  });
}
