import { prismaClient } from '~/server/prisma'

export const beneficiarySecurityTargetSelect = {
  id: true,
  structureId: true,
  referents: { select: { id: true } }
} as const

export const beneficiarySecurityTargetInclude = {
  select: beneficiarySecurityTargetSelect
} as const

export function getBeneficiarySecurityTarget(id: string) {
  return prismaClient.beneficiary.findUnique({
    where: { id },
    select: {
      id: true,
      structureId: true,
      referents: { select: { id: true } }
    }
  })
}
