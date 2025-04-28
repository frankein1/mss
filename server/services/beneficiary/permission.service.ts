import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { BeneficiaryRepo } from '~/server/database'
import {
  FamilyFilePermissions,
  SecurityRuleContext,
  SecurityRuleGrantee,
  getFamilyFilePermissions
} from '~/server/security'
import {
  getGranteRole,
  isInSameStructure,
  isMemberOfReferents
} from '~/server/security/rules/helpers'
import { BeneficiaryService } from '.'

export function getBeneficiarySecurityTarget(
  user: SecurityRuleGrantee,
  id: string
) {
  return BeneficiaryRepo.findWithNoDraftCondition(user, {
    where: { id },
    select: {
      id: true,
      createdById: true,
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
function getBeneficiaryArchiveSecurityTarget(
  user: SecurityRuleGrantee,
  id: string
) {
  return BeneficiaryRepo.findWithNoDraftCondition(user, {
    where: { id },
    select: {
      id: true,
      created: true,
      updated: true,
      archiveDueDate: true,
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

export async function getDeleteDraftPermissions(
  ctx: SecurityRuleContext,
  id: string
): Promise<{ delete: boolean }> {
  const beneficiary = await getBeneficiarySecurityTarget(ctx.user, id)

  if (!isInSameStructure(ctx.user, beneficiary.familyFile)) {
    return {
      delete: false
    }
  }
  return {
    delete: beneficiary.createdById === ctx.user.id
  }
}

export const getArchivePermissions = async ({
  ctx,
  id
}: {
  ctx: SecurityRuleContext
  id: string
}) => {
  const { user } = ctx
  const beneficiary = await getBeneficiaryArchiveSecurityTarget(ctx.user, id)
  const isMember = isMemberOfReferents(user, beneficiary.familyFile)
  const lastActivity = await BeneficiaryService.getLastActivity({
    ctx,
    beneficiaryId: beneficiary.id
  })
  const toArchived = hasToBeArchived(lastActivity)
  const { manager, receptionAgent } = getGranteRole(ctx)

  if (manager) {
    return {
      archive: true
    }
  }
  if (receptionAgent) {
    return {
      archive: false
    }
  }
  return {
    archive: isMember && toArchived
  }
}

/** A beneficiary can be archived 1 year and 11 months after their last activity if
 * no delay has been set
 */
const hasToBeArchived = (lastActivity: Date) => {
  const twoYearsMinusOneMonthsBeforeNow = dayjs()
    .subtract(2, 'year')
    .add(1, 'month')
    .toDate()
  return lastActivity < twoYearsMinusOneMonthsBeforeNow
}
