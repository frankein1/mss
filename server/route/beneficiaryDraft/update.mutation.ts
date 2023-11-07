import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import {
  UpdateBeneficiaryDraftInput,
  updateBeneficiaryDraftSchema
} from '~/server/schema'
import { SecurityRuleGrantee, canUpdateDraft } from '~/server/security'
import type { BeneficiaryDraft } from '~/types/beneficiary'
import { DraftRepo } from '~/server/database'

const securityCheck = async (
  grantee: SecurityRuleGrantee,
  input: UpdateBeneficiaryDraftInput
) => {
  const beneficiaryDraft = (await DraftRepo.findUniqueOrThrow(grantee, {
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
  const beneficiaryDraft = (await DraftRepo.findUniqueOrThrow(user, {
    where: { id: draftId }
  })) as BeneficiaryDraft

  if (!beneficiaryDraft?.content) {
    throw forbiddenError()
  }

  const updatedBeneficiaryDraft = await DraftRepo.prisma.update({
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

  return updatedBeneficiaryDraft
}

export const updateBeneficiaryDraftMutation = createMutation({
  inputValidation: updateBeneficiaryDraftSchema,
  handler,
  securityCheck,
  auditLog: {
    key: 'beneficiaryDraft.update',
    target: 'Draft',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
