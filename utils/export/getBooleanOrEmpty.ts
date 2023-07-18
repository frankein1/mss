export function getBooleanOrEmpty(value: boolean | null | undefined) {
  if (value === undefined || value === null) {
    return ''
  }
  return value ? 'Oui' : 'Non'
}
