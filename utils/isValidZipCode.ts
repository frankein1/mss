export function isValidZipCode(zipcode: string) {
  if (!zipcode) {
    return true
  }

  return zipcode.length === 5
}
