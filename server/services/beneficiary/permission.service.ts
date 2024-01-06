import { BeneficiaryRepo } from '~/server/database'
import {
  BeneficiaryPermissions,
  SecurityRuleContext,
  SecurityRuleGrantee,
  getBeneficiaryPermissions
} from '~/server/security'

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

export async function getUpdatePermission(
  ctx: SecurityRuleContext,
  id: string
): Promise<BeneficiaryPermissions> {
  const beneficiary = await getBeneficiarySecurityTarget(ctx.user, id)
  return getBeneficiaryPermissions({
    ctx,
    beneficiary
  })
}

export function getCreatePermission(
  ctx: SecurityRuleContext
): Promise<BeneficiaryPermissions> {
  return Promise.resolve(
    getBeneficiaryPermissions({
      ctx
    })
  )
}
