import { Prisma } from '@prisma/client'
import { FollowupRepo } from '~/server/repository'
import { StatFilterInput } from '~/server/schema'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareFollowupStatFilters } from '~/utils/filters'

export async function getFollowupActionsEntreprisesStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const referents = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  const { beneficiary: preparedBeneficiaryFilters, ...preparedFilters } =
    prepareFollowupStatFilters(input)

  const beneficiaryFilters: Prisma.BeneficiaryWhereInput =
    preparedBeneficiaryFilters
      ? {
          ...preparedBeneficiaryFilters,
          referents
        }
      : {
          referents
        }

  const followups = await FollowupRepo.findMany(user, {
    where: {
      structureId: user.structureId || '',
      OR: [{ redirected: true }, { helpRequested: true }],
      ...preparedFilters,
      beneficiary: beneficiaryFilters
    },
    select: {
      redirected: true,
      helpRequested: true
    }
  })

  const followupsActionsEntreprises = {
    redirected: {
      actionEntrepriseId: 'redirected',
      actionEntreprise: 'Réorientation',
      _count: 0
    },
    helpRequested: {
      actionEntrepriseId: 'helpRequested',
      actionEntreprise: 'Instruction',
      _count: 0
    }
  }

  followups.forEach(followup => {
    if (followup.redirected) {
      followupsActionsEntreprises.redirected._count++
    }
    if (followup.helpRequested) {
      followupsActionsEntreprises.helpRequested._count++
    }
  })

  const followupsActionsEntreprisesValues = Object.values(
    followupsActionsEntreprises
  )

  followupsActionsEntreprisesValues.sort((a, b) => b._count - a._count)

  return followupsActionsEntreprisesValues
}
