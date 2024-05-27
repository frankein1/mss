import { Prisma } from '@prisma/client'
import { prismaDecimalToNumber } from '~/utils/prisma'

export function incrementBudgetTotal(
  acc: number | null,
  value: Prisma.Decimal | number | string | null | undefined
) {
  const amount = typeof value === 'string' ? parseFloat(value) : value

  const isNumber = typeof amount === 'number'

  if (amount === null || amount === undefined || (isNumber && isNaN(amount))) {
    return acc
  }

  const res = (isNumber ? amount : prismaDecimalToNumber(amount)) || 0
  return acc === null ? res : acc + res
}
