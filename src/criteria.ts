export type CallbackCriteria<T = any> = (key: string, value: T) => void;

export interface AbstractCriteria<T = any> {
  assign(callback: CallbackCriteria<T>): void;
  equals(value: T): boolean;
  key: string;
  value: T;
}

export class Criteria<T> implements AbstractCriteria<T> {
  constructor(
    public readonly key: string,
    public readonly value: T
  ) {}

  public assign(callback: CallbackCriteria<T>): void {
    callback(this.key, this.value);
  }

  public equals(value: T): boolean {
    return this.value === value;
  }
}

export class Criterias {
  private collection: Map<string, AbstractCriteria>;

  constructor() {
    this.collection = new Map();
  }

  public append<T = any>(criteria: AbstractCriteria<T>): this;
  public append<T = any>(key: string, value: T): this;
  public append<T = any>(data: string | AbstractCriteria<T>, value?: T): this {
    if (typeof data === 'string') {
      this.collection.set(data, new Criteria(data, value));
    } else {
      this.collection.set(data.key, data);
    }

    return this;
  }

  public fetch<T = any>(key: string): Undefined<AbstractCriteria<T>> {
    return this.collection.get(key);
  }

  public value<T = any>(key: string): Undefined<T> {
    return this.fetch(key)?.value;
  }

  public equals({ collection }: Criterias): boolean {
    if (this.collection.size !== collection.size) {
      return false;
    }

    const criterias = Array.from(collection.values());

    let equals = true;
    let index = 0;

    while (equals && index < criterias.length) {
      const { key, value } = criterias[index];

      const criteria = this.fetch(key);

      equals = equals && !!criteria && criteria.equals(value);

      index++;
    }

    return equals;
  }

  public toLiteralObject(): LiteralObject {
    const payload: LiteralObject = {};

    this.collection.forEach(({ key, value }) => {
      payload[key] = value;
    });

    return payload;
  }

  public static fromLiteralObject(object: LiteralObject): Criterias {
    const criterias = new Criterias();

    Object.entries(object).forEach(([key, value]) => {
      criterias.append(key, value);
    });

    return criterias;
  }
}
