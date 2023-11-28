import {
  canViewFollowupDetails,
  canViewFollowupPrivateSynthesis
} from '~/server/security'
import { FollowupWithRelations } from '~/server/query/followups'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

function getFollowupMeta(followup: NonNullable<FollowupWithRelations>) {
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

function getFollowupDetails(
  user: SecurityRuleGrantee,
  followup: NonNullable<FollowupWithRelations>
) {
  if (!canViewFollowupDetails(user, followup)) {
    return {}
  }

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

function getFollowupPrivateSynthesis(
  user: SecurityRuleGrantee,
  followup: NonNullable<FollowupWithRelations>
) {
  if (!canViewFollowupPrivateSynthesis(user, followup)) {
    return {}
  }

  return {
    privateSynthesis: followup.privateSynthesis
  }
}

export function getFollowupAccessibleData(
  user: SecurityRuleGrantee,
  followup: NonNullable<FollowupWithRelations>
) {
  const meta = getFollowupMeta(followup)
  const details = getFollowupDetails(user, followup)
  const privateSynthesis = getFollowupPrivateSynthesis(user, followup)

  return {
    ...meta,
    ...details,
    ...privateSynthesis
  }
}
