import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { IdInput, idSchema } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { DraftRepo } from '~/server/database'
import { isCreator } from '~/server/security/rules/helpers'
import { getBeneficiaryPermissions } from '~/server/security'
import { BeneficiaryDraft } from '~/types/beneficiary'

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  const draft = await DraftRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.id }
  })
  return isCreator(ctx.user, draft)
}

const handler = async ({
  input: { id },
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const { user } = ctx
  const draft = (await DraftRepo.findUniqueOrThrow(user, {
    where: { id }
  })) as BeneficiaryDraft

  const permissions = getBeneficiaryPermissions({
    ctx
  })

  return {
    draft: {
      id: draft.id,
      general: draft.content?.general,
      health: draft.content?.health,
      entourage: draft.content?.entourage,
      externalOrganisations: draft.content?.externalOrganisations,
      occupation: draft.content?.occupation,
      taxHousehold: draft.content?.taxHousehold
    },
    permissions
  }
}

export const getBeneficiaryDraftQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
