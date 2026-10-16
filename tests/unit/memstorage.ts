// Minimal localStorage stand-in for node tests. Keys are own enumerable properties, like the real thing.
export class MemStorage {
  getItem(k: string): string | null {
    return Object.prototype.hasOwnProperty.call(this, k) ? (this as any)[k] : null;
  }
  setItem(k: string, v: string) {
    (this as any)[k] = String(v);
  }
  removeItem(k: string) {
    delete (this as any)[k];
  }
}

export function installStorage(): MemStorage {
  const s = new MemStorage();
  (globalThis as any).window = { localStorage: s };
  return s;
}
