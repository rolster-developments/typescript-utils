const PRIMITIVES = [Date, RegExp, Function, String, Boolean, Number];

const SLICE_SIZE = 512;

const FALSY_VALUE = ['false', 'undefined', '0', 0];

const prototypeToString = Object.prototype.toString;

type PromisesFn<T extends any> = () => Promise<T>;

type PromisesProps<T extends any> = {
  error: (error: any) => void;
  index: number;
  promises: PromisesFn<T>[];
  result: T[];
  success: (results: T[]) => void;
};

type Calleable<T> = Undefined<(...args: any) => T>;

const clone = <A>(object: A, caches: unknown[]): A => {
  if (typeof object !== 'object') {
    return object;
  }

  if (prototypeToString.call(object) === '[object Object]') {
    const [cacheObject] = caches.filter(
      (cacheObject) => cacheObject === object
    );

    if (cacheObject) {
      return cacheObject as A;
    }

    caches.push(object);
  }

  const prototypeObject = Object.getPrototypeOf(object);
  const ConstructorObject = prototypeObject.constructor;

  if (PRIMITIVES.includes(ConstructorObject)) {
    return new ConstructorObject(object);
  }

  const cloneObject: A = new ConstructorObject();

  for (const prop in object) {
    cloneObject[prop] = clone<any>(object[prop], caches);
  }

  return cloneObject;
};

const executePromises = <T extends any>(props: PromisesProps<T>): void => {
  const { error, index, promises, result, success } = props;

  if (index === promises.length) {
    return success(result);
  }

  const callback = promises[index];

  new Promise(() => {
    callback()
      .then((value) =>
        executePromises({
          ...props,
          index: index + 1,
          result: [...result, value]
        })
      )
      .catch((err) => error(err));
  });
};

export const isDefined = (object: any): boolean => {
  return typeof object !== 'undefined' && object !== null;
};

export const isUndefined = (object: any): boolean => {
  return !isDefined(object);
};

export const parseBoolean = (value: any): boolean => {
  return !(
    isUndefined(value) ||
    value === false ||
    FALSY_VALUE.includes(value)
  );
};

export const deepClone = <A>(object: A): A => {
  return clone(object, []);
};

export const deepFreeze = <A>(object: A): Readonly<A> => {
  for (const prop in object) {
    const value = object[prop];

    if (typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
};

export const parse = <T>(value: string): T => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
};

export const evalValueOrFunction = <T>(value: ValueOrFunction<T>): T => {
  return typeof value === 'function' ? (value as Function)() : value;
};

export const fromPromise = <M>(value: M | Promise<M>): Promise<M> => {
  return value instanceof Promise ? value : Promise.resolve(value);
};

export const zipPromise = <T = any>(
  promises: PromisesFn<T>[]
): Promise<T[]> => {
  return promises.length
    ? new Promise((resolve, reject) => {
        executePromises({
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
};

export const successPromise = <T>(
  promise: Promise<T>,
  printError = false
): Promise<void> => {
  return promise
    .then(() => undefined)
    .catch((err) => {
      if (printError) {
        console.log(err);
      }

      throw err;
    });
};

export const voidPromise = <T>(
  promise: Promise<T>,
  printError = false
): Promise<void> => {
  return promise
    .then(() => undefined)
    .catch((err) => {
      if (printError) {
        console.log(err);
      }

      return undefined;
    });
};

export const catchPromise = <T>(
  promise: Promise<T>,
  printError = false
): Promise<Undefined<T>> => {
  return promise.catch((err) => {
    if (printError) {
      console.log(err);
    }

    return undefined;
  });
};

export const callback = <T = any>(
  call: Calleable<T>,
  ...args: any
): Undefined<T> => {
  return typeof call !== 'function' ? undefined : call.apply(call, args);
};

export const base64ToBlob = (data64: string, mimeType: string): Blob => {
  const result64 = data64.replace(/^[^,]+,/, '').replace(/\s/g, '');

  const byteCharacters = window.atob(result64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += SLICE_SIZE) {
    const slice = byteCharacters.slice(offset, offset + SLICE_SIZE);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
};
