import { Prisma } from '@prisma/client'

export function prismaDecimalToNumber(
  value: Prisma.Decimal | null | undefined
) {
  return value ? new Prisma.Decimal(value).toNumber() : undefined
}
