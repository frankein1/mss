import type { User } from '@prisma/client'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import {
  canViewFollowup,
  canViewFollowupDetails,
  canViewFollowupPrivateSynthesis
} from '~/server/security/rules'
import {
  FollowupWithBeneficiaryDocumentsAndTypes,
  getFollowupWithBeneficiaryDocumentsAndTypes
} from '~/server/query/followups'

function getFollowupAccessibleData(
  user: User,
  followup: NonNullable<FollowupWithBeneficiaryDocumentsAndTypes>
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

function getFollowupMeta(
  followup: NonNullable<FollowupWithBeneficiaryDocumentsAndTypes>
) {
  return {
    id: followup.id,
    structureId: followup.structureId,
    created: followup.created,
    createdById: followup.createdById,
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
  user: User,
  followup: NonNullable<FollowupWithBeneficiaryDocumentsAndTypes>
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
    interventions: followup.interventions,
    ministre: followup.ministre,
    numeroPegase: followup.numeroPegase,
    place: followup.place,
    prescribingOrganizationId: followup.prescribingOrganizationId,
    signalements: followup.signalements,
    structureName: followup.structureName,
    synthesis: followup.synthesis,
    thirdPersonName: followup.thirdPersonName
  }
}

function getFollowupPrivateSynthesis(
  user: User,
  followup: NonNullable<FollowupWithBeneficiaryDocumentsAndTypes>
) {
  if (!canViewFollowupPrivateSynthesis(user, followup)) {
    return {}
  }

  return {
    privateSynthesis: followup.privateSynthesis
  }
}

export const getFollowupDetailsHandler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const followup = await getFollowupWithBeneficiaryDocumentsAndTypes(id)

  if (!followup || !canViewFollowup(user, followup.beneficiary)) {
    throw forbiddenError()
  }

  const data = getFollowupAccessibleData(user, followup)

  return data
}
