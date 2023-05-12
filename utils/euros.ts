import { Decimal } from '@prisma/client/runtime'

export function euros(price: Decimal | number) {
  const [integerPart, decimalPart] = price.toString().split('.')
  const firstDigit = decimalPart?.length > 0 ? decimalPart[0] : '0'
  const secondDigit = decimalPart?.length > 1 ? decimalPart[1] : '0'

  return `${integerPart},${firstDigit}${secondDigit} €`
}
