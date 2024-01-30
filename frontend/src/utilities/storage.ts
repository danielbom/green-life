export class KeyStore {
  constructor(private key: string, private storage: Storage) {}

  static local(key: string): KeyStore {
    return new KeyStore(key, localStorage)
  }

  static session(key: string): KeyStore {
    return new KeyStore(key, sessionStorage)
  }

  get(): string | null {
    return this.storage.getItem(this.key)
  }

  set(value: string): void {
    return this.storage.setItem(this.key, value)
  }

  remove(): void {
    return this.storage.removeItem(this.key)
  }
}
