import { Prisma } from '~/prisma/generated/browser'
import type { Decimal } from '@prisma/client/runtime/client'

export function prismaDecimalToNumber(value: Decimal | null | undefined) {
  return value ? new Prisma.Decimal(value).toNumber() : undefined
}
