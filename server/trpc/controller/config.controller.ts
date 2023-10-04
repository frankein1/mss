import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { getUserDisplayName } from '~/utils/user'
import {
  canViewAnyHelpRequestDetails,
  canOnlyListItsBeneficiaries,
  SecurityRuleGrantee
} from '~/server/security/rules'

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

export const getBeneficiariesCitiesHandler = async ({
  ctx: { user, structure }
}: {
  ctx: ProtectedAppContext
}) => {
  const referentsCondition = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  return await prismaClient.beneficiary.groupBy({
    by: ['city'],
    where: {
      city: { not: null },
      structureId: structure.id,
      referents: referentsCondition
    },
    orderBy: [{ city: 'asc' }]
  })
}

function hasDefinedExaminationDate(h: {
  examinationDate: Date | null
}): h is { examinationDate: Date } {
  return h.examinationDate !== null
}

function prepareExaminationDatesBeneficiaryCondition(
  beneficiaryId: string | undefined,
  user: SecurityRuleGrantee
) {
  if (beneficiaryId) {
    return { id: beneficiaryId }
  }
  if (canOnlyListItsBeneficiaries(user)) {
    return { referents: { some: { id: user.id } } }
  }
  return undefined
}

export const getExaminationDatesHandler = async ({
  input,
  ctx: { user, structure }
}: {
  input: { id: string } | undefined
  ctx: ProtectedAppContext
}) => {
  if (!canViewAnyHelpRequestDetails(user)) {
    return []
  }

  const beneficiaryCondition = prepareExaminationDatesBeneficiaryCondition(
    input?.id,
    user
  )

  const examinationDates = await prismaClient.helpRequest.groupBy({
    by: ['examinationDate'],
    where: {
      examinationDate: { not: null },
      structureId: structure.id,
      beneficiary: beneficiaryCondition
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
  ctx: { structure }
}: {
  ctx: ProtectedAppContext
}) => {
  return await prismaClient.prescribingOrganization.findMany({
    where: {
      structureId: structure.id
    },
    orderBy: [{ name: 'asc' }]
  })
}

export const getStructureFollowupTypesHandler = async ({
  ctx: { structure }
}: {
  ctx: ProtectedAppContext
}) => {
  return await prismaClient.followupType.findMany({
    where: {
      ownedByStructureId: structure.id
    },
    orderBy: [{ name: 'asc' }]
  })
}
