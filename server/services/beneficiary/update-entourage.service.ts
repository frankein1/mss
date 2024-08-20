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
          }
        }
      },
      relatives: true
    }
  })
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

  const newEntourages = entourages?.filter(filterOutEmptyElements) || []

  const entouragesRelationUpdates = prepareRelationUpdates(
    newEntourages,
    previousRelatives
  )

  const data = { relatives: entouragesRelationUpdates }

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id },
    data
  })

  return updatedBeneficiary
}
