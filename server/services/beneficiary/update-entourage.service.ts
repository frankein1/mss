import { BudgetIncomeType, Prisma } from '@prisma/client'
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
          id: true,
          income: { select: { id: true } }
        }
      }
    }
  })
}

function prepareUpdates(
  newEntourages: UpdateBeneficiaryEntourageInput['entourages'],
  previousRelatives: { id: string; income: { id: string } | null }[],
  budgetId: string
): Prisma.BeneficiaryUpdateInput['relatives'] {
  const filtered = newEntourages?.filter(filterOutEmptyElements) || []

  const relations = prepareRelationUpdates(filtered, previousRelatives)

  // If a created relative is hosted by the beneficiary, an income is created for them
  const create = relations.create.map(relation => ({
    ...(relation.hosted && {
      income: { create: { budgetId, type: BudgetIncomeType.HouseholdMember } }
    }),
    ...relation
  }))

  // If an updated relative is not hosted anymore, their income is deleted if exists
  const relativeHasIncome = (relativeId: string) => {
    const relative = previousRelatives.find(prev => prev.id === relativeId)
    return Boolean(relative?.income?.id)
  }

  const update = relations.update.map(relation => {
    const shouldDeleteIncome =
      relativeHasIncome(relation.where.id) && !relation.data.hosted
    return {
      where: relation.where,
      data: {
        ...(shouldDeleteIncome && { income: { delete: true } }),
        ...relation.data
      }
    }
  })

  return {
    ...relations,
    create,
    update
  }
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
    relatives: prepareUpdates(
      entourages || [],
      previousRelatives,
      beneficiary.familyFile.budget?.id || ''
    )
  }

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id },
    data
  })

  return updatedBeneficiary
}
