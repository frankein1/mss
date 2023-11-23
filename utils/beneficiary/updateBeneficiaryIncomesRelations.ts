import { RelativeRelationship } from '@prisma/client'
import { v4 } from 'uuid'
import { BeneficiaryRepo, DraftRepo } from '~/server/database'
import { SecurityRuleGrantee } from '~/server/security'
import { PreparedDraftData } from '~/utils/beneficiary'
import { prepareRelationUpdates } from '~/utils/prisma'

function getBeneficiaryWithTaxHouseholdAndIncomes(
  user: SecurityRuleGrantee,
  id: string
) {
  return BeneficiaryRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      id: true,
      structureId: true,
      incomes: true,
      relatives: {
        include: { linkedBeneficiary: true },
        where: { hosted: true }
      }
    }
  })
}

export async function updateBeneficiaryIncomesRelations(
  user: SecurityRuleGrantee,
  id: string,
  draftContent?: PreparedDraftData
) {
  const beneficiary = !draftContent
    ? await getBeneficiaryWithTaxHouseholdAndIncomes(user, id)
    : undefined

  const previousIncomes =
    !draftContent && beneficiary
      ? beneficiary.incomes
      : draftContent?.occupation?.incomes ?? []

  const relatives =
    !draftContent && beneficiary
      ? beneficiary.relatives
      : draftContent?.taxHousehold?.taxHouseholds ?? []

  const newIncomes = Array.from(
    new Set(
      relatives
        .map(relative => relative.relationship)
        .filter(
          relationship =>
            !!relationship &&
            relationship !== RelativeRelationship.Conjoint &&
            relationship !== RelativeRelationship.EnfantMajeur &&
            relationship !== RelativeRelationship.EnfantMineur
        )
    )
  ).map(relationship => {
    const previousIncome = previousIncomes.find(
      income => income.hostedRelative === relationship
    )
    return {
      id: previousIncome?.id || v4(),
      hostedRelative: relationship,
      incomeSource: previousIncome?.incomeSource || []
    }
  })

  if (draftContent) {
    if (draftContent.occupation) {
      draftContent.occupation.incomes = newIncomes
    }

    await DraftRepo.prisma.update({
      where: { id },
      data: {
        content: draftContent
      }
    })
  } else {
    await BeneficiaryRepo.prisma.update({
      where: { id },
      data: {
        incomes: prepareRelationUpdates(
          newIncomes,
          beneficiary?.incomes ?? [],
          false
        )
      }
    })
  }
}
