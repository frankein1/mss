import type { Prisma } from '@prisma/client'

export function euros(
  price: Prisma.Decimal | number | string | undefined | null
) {
  if (price !== 0 && !price) {
    return ''
  }

  const p = typeof price === 'string' ? parseFloat(price) : price

  if (typeof p === 'number' && isNaN(p)) {
    return ''
  }

  const [integerPart, decimalPart] = p.toFixed(2).toString().split('.')

  if (!decimalPart || decimalPart.length === 0 || decimalPart === '00') {
    return integerPart
  }

  return `${integerPart},${decimalPart[0]}${decimalPart.length > 1 ? decimalPart[1] : '0'}`
}
