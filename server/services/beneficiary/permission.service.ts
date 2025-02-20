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
  const archiveDueDate = beneficiary.archiveDueDate
  const lastActivity = await BeneficiaryService.getLastActivity({
    ctx,
    beneficiaryId: beneficiary.id
  })
  const toArchived = hasToBeArchived(lastActivity, archiveDueDate)
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

const hasToBeArchived = (lastActivity: Date, archiveDueDate: Date | null) => {
  const twoYearsBeforeNow = dayjs().subtract(2, 'year').toDate()
  const delayDecisionDate = dayjs(archiveDueDate).subtract(1, 'year').toDate()
  if (!archiveDueDate) {
    return lastActivity < twoYearsBeforeNow
  }
  if (lastActivity < delayDecisionDate) {
    return lastActivity < twoYearsBeforeNow
  }
  return lastActivity < twoYearsBeforeNow
}
