import { Prisma } from '@prisma/client'
import { BeneficiaryRepo, FamilyFileRepo } from '~/server/database'
import {
  BeneficiaryPermissions,
  SecurityRuleContext,
  SecurityRuleGrantee,
  getBeneficiaryPermissions
} from '~/server/security'

export function getFamilyFileSecurityTarget(
  user: SecurityRuleGrantee,
  id: string
) {
  return FamilyFileRepo.findUniqueOrThrow(user, {
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

export type FamilyFileSecurityTarget = Prisma.PromiseReturnType<
  typeof getFamilyFileSecurityTarget
>

export async function getEditionPermissions(
  ctx: SecurityRuleContext,
  id: string
): Promise<BeneficiaryPermissions> {
  const beneficiary = await getBeneficiarySecurityTarget(ctx.user, id)
  return getBeneficiaryPermissions({
    ctx,
    beneficiary
  })
}

export function getCreationPermissions(
  ctx: SecurityRuleContext
): Promise<BeneficiaryPermissions> {
  return Promise.resolve(
    getBeneficiaryPermissions({
      ctx
    })
  )
}
