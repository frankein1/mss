import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import {
  UpdateBeneficiaryDraftInput,
  updateBeneficiaryDraftSchema
} from '~/server/schema'
import type { BeneficiaryDraft } from '~/types/beneficiary'
import { DraftRepo } from '~/server/repository'
import { AllowSecurityCheck } from '~/server/security/rules/types'

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
  const beneficiaryDraft = (await DraftRepo.findUniqueOrThrow(user, {
    where: { id: draftId }
  })) as BeneficiaryDraft

  if (!beneficiaryDraft?.content) {
    throw forbiddenError()
  }

  const updatedBeneficiaryDraft = await DraftRepo.update(user, {
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
  securityCheck: AllowSecurityCheck
})
