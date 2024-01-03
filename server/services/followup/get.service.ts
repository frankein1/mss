import { Prisma } from '@prisma/client'
import { FollowupRepo } from '~/server/database'
import { SecurityRuleGrantee, getFollowupPermissions } from '~/server/security'

export function get({ user, id }: { user: SecurityRuleGrantee; id: string }) {
  return FollowupRepo.findUniqueOrThrow(user, {
    where: { id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      },
      documents: true,
      types: true,
      prescribingOrganization: true,
      createdBy: true
    }
  })
}

export type FollowupTree = Prisma.PromiseReturnType<typeof get>

function getMeta(followup: NonNullable<FollowupTree>) {
  return {
    id: followup.id,
    structureId: followup.structureId,
    created: followup.created,
    createdBy: followup.createdBy,
    createdById: followup.createdById,
    updated: followup.updated,
    date: followup.date,
    firstFollowup: followup.firstFollowup,
    status: followup.status,
    redirected: followup.redirected,
    types: followup.types,
    beneficiary: followup.beneficiary,
    beneficiaryId: followup.beneficiaryId
  }
}

function getDetails(followup: NonNullable<FollowupTree>) {
  return {
    medium: followup.medium,
    classified: followup.classified,
    documents: followup.documents,
    dueDate: followup.dueDate,
    forwardedToJustice: followup.forwardedToJustice,
    helpRequested: followup.helpRequested,
    // interventions: followup.interventions,
    ministre: followup.ministre,
    numeroPegase: followup.numeroPegase,
    place: followup.place,
    prescribingOrganizationId: followup.prescribingOrganizationId,
    prescribingOrganization: followup.prescribingOrganization,
    // signalements: followup.signalements,
    structureName: followup.structureName,
    synthesis: followup.synthesis,
    thirdPersonName: followup.thirdPersonName
  }
}

export function filter(
  user: SecurityRuleGrantee,
  followup: NonNullable<FollowupTree>
) {
  const permissions = getFollowupPermissions({
    user,
    beneficiary: followup.beneficiary,
    followup
  })
  const meta = getMeta(followup)
  const details = permissions.get.details ? getDetails(followup) : {}
  const privateSynthesis = permissions.set.privateSynthesis
    ? followup.privateSynthesis
    : {}

  return {
    ...meta,
    ...details,
    ...privateSynthesis
  }
}
