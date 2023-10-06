import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import {
  UpdateBeneficiaryDraftInput,
  updateBeneficiaryDraftSchema
} from '~/server/schema'
import { SecurityRuleGrantee, canUpdateDraft } from '~/server/security/rules'
import type { BeneficiaryDraft } from '~/types/beneficiary'

const securityCheck = async (
  grantee: SecurityRuleGrantee,
  input: UpdateBeneficiaryDraftInput
) => {
  const beneficiaryDraft = (await prismaClient.draft.findUniqueOrThrow({
    where: { id: input.id }
  })) as BeneficiaryDraft

  return canUpdateDraft(grantee, beneficiaryDraft)
}

const handler = async ({
  input: {
    id: draftId,
    general,
    taxHousehold,
    entourage,
    health,
    occupation,
    externalOrganisations
  },
  ctx: { user }
}: {
  input: UpdateBeneficiaryDraftInput
  ctx: ProtectedAppContext
}) => {
  const beneficiaryDraft = (await prismaClient.draft.findUniqueOrThrow({
    where: { id: draftId }
  })) as BeneficiaryDraft

  if (!beneficiaryDraft?.content) {
    throw forbiddenError()
  }

  const updatedBeneficiaryDraft = await prismaClient.draft.update({
    where: { id: draftId },
    data: {
      content: {
        general: general || beneficiaryDraft.content.general,
        taxHousehold: taxHousehold || beneficiaryDraft.content.taxHousehold,
        entourage: entourage || beneficiaryDraft.content.entourage,
        health: health || beneficiaryDraft.content.health,
        occupation: occupation || beneficiaryDraft.content.occupation,
        externalOrganisations:
          externalOrganisations ||
          beneficiaryDraft.content.externalOrganisations
      }
    }
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.UPDATE,
    object: 'Draft',
    objectId: beneficiaryDraft.id
  })

  return updatedBeneficiaryDraft
}

export const updateBeneficiaryDraftMutation = createMutation({
  inputValidation: updateBeneficiaryDraftSchema,
  handler,
  securityCheck
})
