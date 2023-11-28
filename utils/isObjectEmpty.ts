export const isObjectEmpty = (object: { [k: string]: any } | undefined) => {
  if (!object) {
    return true
  }
  return Object.values(object).every(
    x =>
      x === undefined ||
      x === null ||
      x === '' ||
      (Array.isArray(x) && x.length === 0)
  )
}
