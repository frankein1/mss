import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import {
  UpdateBeneficiaryDraftInput,
  updateBeneficiaryDraftSchema
} from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import type { BeneficiaryDraft } from '~/types/beneficiary'
import { DraftRepo } from '~/server/database'
import { isCreator } from '~/server/security/rules/helpers'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateBeneficiaryDraftInput
) => {
  const beneficiaryDraft = (await DraftRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.id }
  })) as BeneficiaryDraft

  return isCreator(ctx.user, beneficiaryDraft)
}

function cleanInput(input: UpdateBeneficiaryDraftInput) {
  if (!input.general) {
    return input
  }

  if (input.general.noPhone) {
    input.general.phone1 = null
    input.general.phone2 = null
  }

  return input
}

const handler = async ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryDraftInput
  ctx: ProtectedAppContext
}) => {
  const { id: draftId } = input

  const beneficiaryDraft = (await DraftRepo.findUniqueOrThrow(user, {
    where: { id: draftId }
  })) as BeneficiaryDraft

  if (!beneficiaryDraft?.content) {
    throw forbiddenError()
  }

  const {
    general,
    taxHousehold,
    entourage,
    health,
    occupation,
    externalOrganisations
  } = cleanInput(input)

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
