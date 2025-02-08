const PRIMITIVES = [Date, RegExp, Function, String, Boolean, Number];

const SLICE_SIZE = 512;

const FALSY_VALUE = ['false', 'undefined', '0', 0];

const prototypeToString = Object.prototype.toString;

type Calleable<T> = Undefined<(...args: any) => T>;

type ReplaceClone<C> = Partial<{ [K in keyof C]: C[K] }>;

function _clone<O>(
  object: O,
  caches: unknown[],
  replaces?: ReplaceClone<O>
): O {
  if (typeof object !== 'object') {
    return object;
  }

  if (prototypeToString.call(object) === '[object Object]') {
    const [_object] = caches.filter((_object) => _object === object);

    /* istanbul ignore if */
    if (_object) {
      return _object as O;
    }

    caches.push(object);
  }

  const prototypeObject = Object.getPrototypeOf(object);
  const ConstructorObject = prototypeObject.constructor;

  if (PRIMITIVES.includes(ConstructorObject)) {
    return new ConstructorObject(object);
  }

  const _object: O = new ConstructorObject();

  for (const key in object) {
    _object[key] = replaces
      ? replaces[key] ?? _clone<any>(object[key], caches)
      : _clone<any>(object[key], caches);
  }

  return _object;
}

export function itIsDefined<T = any>(object: T): object is NonNullable<T> {
  return typeof object !== 'undefined' && object !== null;
}

export function itIsUndefined(object: any): object is undefined | null {
  return !itIsDefined(object);
}

export function parseBoolean(value: any): boolean {
  return !(
    itIsUndefined(value) ||
    value === false ||
    FALSY_VALUE.includes(value)
  );
}

export function parse<T>(value: string): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
}

export function evalValueOrFunction<T>(value: ValueOrFunction<T>): T {
  return typeof value === 'function' ? (value as Function)() : value;
}

export function clone<O>(object: O, replaces?: ReplaceClone<O>): O {
  return _clone(object, [], replaces);
}

export function freeze<A>(object: A): Readonly<A> {
  for (const prop in object) {
    const value = object[prop];

    if (typeof value === 'object' && !Object.isFrozen(value)) {
      freeze(value);
    }
  }

  return Object.freeze(object);
}

export function callback<T = any>(
  call: Calleable<T>,
  ...args: any
): Undefined<T> {
  return typeof call !== 'function' ? undefined : call.apply(call, args);
}

function normalizeValue(value: any): void {
  return typeof value === 'object'
    ? Array.isArray(value)
      ? value.map((value) => normalizeValue(value))
      : normalizeJson(value)
    : value;
}

export function normalizeJson(payload: LiteralObject): LiteralObject {
  return Object.entries(payload).reduce(
    (result: LiteralObject, [key, value]) => {
      if (itIsDefined(value)) {
        result[key] = normalizeValue(value);
      }

      return result;
    },
    {}
  );
}

/* istanbul ignore next */
export function base64ToBlob(data64: string, mimeType: string): Blob {
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
}
