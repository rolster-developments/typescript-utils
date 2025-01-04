export type SealedState<R> = Record<string, (value?: any) => R>;

export class Sealed<R, V, T extends SealedState<R>> {
  private currentOtherwise?: () => void;

  protected constructor(
    private key: keyof T,
    private value?: V
  ) {}

  public otherwise(otherwise: () => void): this {
    this.currentOtherwise = otherwise;

    return this;
  }

  public when(resolver: T, whenOtherwise?: () => void): R {
    const handler = resolver[this.key];

    const otherwise = whenOtherwise ?? this.currentOtherwise;

    if (otherwise) {
      otherwise();
    }

    if (handler) {
      return handler(this.value);
    }

    /* istanbul ignore next */
    throw Error('Sealed class could not resolve call');
  }

  public is(key: keyof T): boolean {
    return this.key === key;
  }
}

export class PartialSealed<R, V, T extends SealedState<R>> {
  private currentOtherwise?: () => void;

  protected constructor(
    private key: keyof T,
    private value?: V
  ) {}

  public otherwise(otherwise: () => void): this {
    this.currentOtherwise = otherwise;

    return this;
  }

  public when(resolver: Partial<T>, whenOtherwise?: () => void): Undefined<R> {
    const handler = resolver[this.key];

    const otherwise = whenOtherwise || this.currentOtherwise;

    if (otherwise) {
      otherwise();
    }

    return handler ? handler(this.value) : undefined;
  }

  public is(key: keyof T): boolean {
    return this.key === key;
  }
}
