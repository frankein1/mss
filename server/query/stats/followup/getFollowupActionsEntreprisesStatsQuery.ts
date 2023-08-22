import { prismaClient } from '~/server/prisma'
import { StatFilterInput } from '~/server/schema'
import { prepareFollowupStatFilters } from '~/utils/filters'

export async function getFollowupActionsEntreprisesStatsQuery(
  structureId: string,
  input: StatFilterInput
) {
  const followups = await prismaClient.followup.findMany({
    where: {
      structureId,
      OR: [{ redirected: true }, { helpRequested: true }],
      ...prepareFollowupStatFilters(input)
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
