export function hasDefinedCity(b: {
  city: string | null
}): b is { city: string } {
  return b.city !== null
}
