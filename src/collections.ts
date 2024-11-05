export class SecureMap<V = unknown, K = string> extends Map<K, V> {
  public request(key: K, initialValue: V | (() => V)): V {
    let value = this.get(key);

    if (!value) {
      value =
        typeof initialValue === 'function'
          ? ((initialValue as Function)() as V)
          : initialValue;

      this.set(key, value);
    }

    return value;
  }
}
