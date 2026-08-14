import type { SecurityRuleGrantee } from '~~/server/security'
import { PartnerOrganizationRepo } from '~~/server/database'
import { prismaClient } from '~~/server/prisma'
import { validateManyBelongToStructure } from './validate-belongs-to-structure'

function nonEmpty(id: string | null | undefined): id is string {
  return !!id && id !== ''
}

async function validateContactsBelongToStructure(
  user: SecurityRuleGrantee,
  contactIds: string[]
): Promise<boolean> {
  const uniqueIds = [...new Set(contactIds)]
  if (uniqueIds.length === 0) {
    return true
  }

  if (!user.structureId) {
    return false
  }

  // Direct use of prismaClient since this is the only place that a query for partner organisation contact is used
  // There are no restriction except the one coming from the structure so this is acceptable
  const count = await prismaClient.partnerOrganizationContact.count({
    where: {
      id: { in: uniqueIds },
      partner: {
        structureId: user.structureId
      }
    }
  })
  return count === uniqueIds.length
}

export async function validatePartnerOrganizationIds(
  user: SecurityRuleGrantee,
  partnerOrganizationIds: (string | null | undefined)[],
  contactIds: (string | null | undefined)[]
): Promise<boolean> {
  const orgIds = partnerOrganizationIds.filter(nonEmpty)
  const filteredContactIds = contactIds.filter(nonEmpty)

  if (orgIds.length === 0 && filteredContactIds.length === 0) {
    return true
  }

  const [orgsValid, contactsValid] = await Promise.all([
    validateManyBelongToStructure(user, orgIds, PartnerOrganizationRepo.count),
    validateContactsBelongToStructure(user, filteredContactIds)
  ])

  return orgsValid && contactsValid
}
