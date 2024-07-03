import { Prisma } from '@prisma/client'
import { BeneficiaryRepo } from '~/server/database'
import {
  FamilyFilePermissions,
  SecurityRuleContext,
  SecurityRuleGrantee,
  getFamilyFilePermissions
} from '~/server/security'

export function getBeneficiarySecurityTarget(user: SecurityRuleGrantee, id: string) {
  return BeneficiaryRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      id: true,
      familyFile: {
        select: {
          structureId: true,
          referents: {
            select: { id: true, role: true, status: true, structureId: true }
          }
        }
      }
    }
  })
}

export type BeneficiarySecurityTarget = Prisma.PromiseReturnType<
  typeof getBeneficiarySecurityTarget
>

export async function getEditionPermissions(
  ctx: SecurityRuleContext,
  id: string
): Promise<FamilyFilePermissions> {
  const beneficiary = await getBeneficiarySecurityTarget(ctx.user, id)
  return getFamilyFilePermissions({
    ctx,
    familyFile: beneficiary.familyFile
  })
}
