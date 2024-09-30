import { Prisma } from '@prisma/client'
import { BeneficiaryRepo } from '~/server/database'
import {
  SecurityRuleContext,
  getAppContextPermissions,
  getFamilyFilePermissions
} from '~/server/security'
// TODO filter simplified for get-details
import { filter } from './queries'

const selectfamilyFileForPermissions: Prisma.FamilyFileSelect = {
  structureId: true,
  referents: {
    select: {
      id: true
    }
  }
}

const includeDetails = {
  familyFile: { select: selectfamilyFileForPermissions },
  socialSupports: {
    select: {
      subjects: {
        select: {
          id: true,
          name: true
        }
      }
    }
  },
  relatives: {
    select: {
      id: true,
      lastName: true,
      firstName: true,
      relationship: true,
      city: true,
      email: true,
      phone: true,
      hosted: true,
      caregiver: true,
      beneficiaryId: true,
      additionalInformation: true,
      birthDate: true
    }
  },
  _count: {
    select: { socialSupports: true }
  }
}

export async function getDetails(ctx: SecurityRuleContext, id: string) {
  const beneficiary = await BeneficiaryRepo.findWithNoDraftCondition(ctx.user, {
    where: { id },
    include: includeDetails
  })

  const permissions = getFamilyFilePermissions({
    ctx,
    familyFile: beneficiary.familyFile
  })

  const appPermissions = getAppContextPermissions(ctx)

  return {
    beneficiary: filter(permissions, appPermissions, beneficiary),
    permissions
  }
}
