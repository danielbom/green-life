export function removeEquals<T>(base: T, update: Partial<T>) {
  const result = { ...update }
  for (const key in base) {
    if (base[key] === result[key]) {
      delete result[key]
    }
  }
  return result
}
