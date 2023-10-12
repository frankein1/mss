import type { Prisma } from '@prisma/client'
import { SecurityRuleGrantee } from '../../security/rules'
import { BeneficiaryRepo } from '~/server/repository'

export const beneficiarySecurityTargetSelect = {
  id: true,
  structureId: true,
  referents: { select: { id: true } }
} as const

export const beneficiarySecurityTargetInclude = {
  select: beneficiarySecurityTargetSelect
} as const

export function getBeneficiarySecurityTarget(
  user: SecurityRuleGrantee,
  id: string
) {
  return BeneficiaryRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      id: true,
      structureId: true,
      referents: {
        select: { id: true, role: true, status: true, structureId: true }
      }
    }
  })
}

export type BeneficiarySecurityTarget = Prisma.PromiseReturnType<
  typeof getBeneficiarySecurityTarget
>
