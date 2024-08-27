import { Prisma } from '@prisma/client'
import { filterOutEmptyElements } from '../helper'
import { SecurityRuleContext, SecurityRuleGrantee } from '~/server/security'
import { UpdateBeneficiaryEntourageInput } from '~/server/schema'
import { BeneficiaryRepo } from '~/server/database'
import { prepareRelationUpdates } from '~/utils/prisma'

function getBeneficiarySecurityTargetWithEntourage(
  user: SecurityRuleGrantee,
  id: string
) {
  return BeneficiaryRepo.findWithNoDraftCondition(user, {
    where: { id },
    select: {
      id: true,
      structureId: true,
      familyFile: {
        select: {
          referents: {
            select: { id: true, role: true, structureId: true }
          },
          budget: {
            select: { id: true }
          }
        }
      },
      relatives: {
        select: {
          id: true
        }
      }
    }
  })
}

function prepareUpdates(
  newEntourages: UpdateBeneficiaryEntourageInput['entourages'],
  previousRelatives: { id: string }[]
): Prisma.BeneficiaryUpdateInput['relatives'] {
  const filtered = newEntourages?.filter(filterOutEmptyElements) || []

  return prepareRelationUpdates(filtered, previousRelatives)
}

export async function updateEntourage({
  user,
  input
}: {
  user: SecurityRuleContext['user']
  input: UpdateBeneficiaryEntourageInput
}) {
  const beneficiary = await getBeneficiarySecurityTargetWithEntourage(
    user,
    input.id
  )

  const { id, entourages } = input

  const { relatives: previousRelatives } = beneficiary

  const data: Prisma.BeneficiaryUpdateInput = {
    relatives: prepareUpdates(entourages || [], previousRelatives)
  }

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id },
    data
  })

  return updatedBeneficiary
}
