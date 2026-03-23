import { StructureType } from '@prisma/client'
import { prepareSocialSupportStatFilters } from '../helpers'
import { FollowupRepo } from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { ProtectedAppContext } from '~/server/trpc'

export async function getFollowupActionsEntreprisesStatsQuery(
  ctx: ProtectedAppContext,
  input: StatFilterInput
) {
  const preparedSocialSupportFilters = prepareSocialSupportStatFilters(input)
  const isMinister = ctx.structure.type === StructureType.Ministere

  const followups = await FollowupRepo.findMany(ctx.user, {
    where: {
      socialSupport: preparedSocialSupportFilters
    },
    select: {
      helpRequested: true,
      classified: isMinister,
      forwardedToJustice: isMinister
    }
  })

  const followupsActionsEntreprises = {
    helpRequested: {
      actionEntrepriseId: 'helpRequested',
      actionEntreprise: 'Instruction',
      _count: 0
    },
    ...(isMinister && {
      classified: {
        actionEntrepriseId: 'helpRequested',
        actionEntreprise: 'Classé',
        _count: 0
      },
      forwardedToJustice: {
        actionEntrepriseId: 'forwardedToJustice',
        actionEntreprise: 'Transmis à la justice',
        _count: 0
      }
    })
  }

  followups.forEach(followup => {
    if (followup.helpRequested) {
      followupsActionsEntreprises.helpRequested._count++
    }
    if (
      !followup.classified &&
      isMinister &&
      followupsActionsEntreprises.classified
    ) {
      followupsActionsEntreprises.classified._count++
    }
    if (
      !followup.forwardedToJustice &&
      isMinister &&
      followupsActionsEntreprises.forwardedToJustice
    ) {
      followupsActionsEntreprises.forwardedToJustice._count++
    }
  })

  const followupsActionsEntreprisesValues = Object.values(
    followupsActionsEntreprises
  )

  followupsActionsEntreprisesValues.sort((a, b) => b._count - a._count)

  return followupsActionsEntreprisesValues
}
