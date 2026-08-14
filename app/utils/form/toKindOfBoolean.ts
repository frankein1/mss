export function toKindOfBoolean(
  value: boolean | null | undefined
): 'true' | 'false' | undefined {
  if (value == null) {
    return undefined
  }

  return value ? 'true' : 'false'
}
