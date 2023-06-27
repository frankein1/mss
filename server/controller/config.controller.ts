import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { getUserDisplayName } from '~/utils/user'
import { canViewAnyHelpRequestDetails } from '~/server/security/rules'

export const getAgentsHandler = async ({
  ctx: { user }
}: {
  ctx: ProtectedAppContext
}) => {
  return await prismaClient.user
    .findMany({
      where: {
        role: { not: 'Administrator' },
        structureId: user.structureId
      },
      orderBy: { lastName: 'asc' }
    })
    .then(agents =>
      agents.map(user => ({
        id: user.id,
        name: getUserDisplayName(user),
        status: user.status
      }))
    )
}

export const getBeneficiariesCitiesHandler = async () => {
  return await prismaClient.beneficiary.groupBy({
    by: ['city'],
    where: {
      city: { not: null }
    },
    orderBy: [{ city: 'asc' }]
  })
}

function hasDefinedExaminationDate(h: {
  examinationDate: Date | null
}): h is { examinationDate: Date } {
  return h.examinationDate !== null
}

export const getExaminationDatesHandler = async ({
  input,
  ctx: { user }
}: {
  input: { id: string } | undefined
  ctx: ProtectedAppContext
}) => {
  if (!canViewAnyHelpRequestDetails(user)) {
    return []
  }

  const examinationDates = await prismaClient.helpRequest.groupBy({
    by: ['examinationDate'],
    where: {
      examinationDate: { not: null },
      beneficiaryId: input?.id || undefined
    },
    orderBy: [{ examinationDate: 'desc' }]
  })

  return examinationDates.filter(hasDefinedExaminationDate)
}

export const getInstructorOrganizationHandler = async ({
  ctx: { user }
}: {
  ctx: ProtectedAppContext
}) => {
  return await prismaClient.instructorOrganization.findMany({
    where: {
      structureId: user.structureId
    },
    orderBy: [{ name: 'asc' }]
  })
}

export const getPrescribingOrganizationsHandler = async ({
  ctx: { user }
}: {
  ctx: ProtectedAppContext
}) => {
  return await prismaClient.prescribingOrganization.findMany({
    where: {
      structureId: user.structureId
    },
    orderBy: [{ name: 'asc' }]
  })
}

export const getStructureFollowupTypesHandler = async ({
  ctx: { user }
}: {
  ctx: ProtectedAppContext
}) => {
  return await prismaClient.followupType.findMany({
    where: {
      ownedByStructureId: user.structureId
    },
    orderBy: [{ name: 'asc' }]
  })
}
