export class SecureMap<V = any, K = string> extends Map<K, V> {
  public request(key: K, initialValue: V): V {
    let value = this.get(key);

    if (!value) {
      value = initialValue;
      this.set(key, value);
    }

    return value;
  }
}
