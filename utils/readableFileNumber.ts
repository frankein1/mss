export function readableFileNumber(beneficiaryId: string) {
  return beneficiaryId.slice(0, 8).toUpperCase()
}
