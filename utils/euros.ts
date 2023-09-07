import type { Prisma } from '@prisma/client'

export function euros(price: Prisma.Decimal | number) {
  const [integerPart, decimalPart] = price.toString().split('.')
  const firstDigit = decimalPart?.length > 0 ? decimalPart[0] : '0'
  const secondDigit = decimalPart?.length > 1 ? decimalPart[1] : '0'

  return `${integerPart},${firstDigit}${secondDigit} €`
}
