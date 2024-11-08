export class SecureMap<V = unknown, K = string> extends Map<K, V> {
  constructor(private initialValue: () => V) {
    super();
  }

  public request(key: K, initialValue?: V): V {
    let value = this.get(key);

    if (!value) {
      value = initialValue ?? this.initialValue();

      this.set(key, value);
    }

    return value;
  }
}
