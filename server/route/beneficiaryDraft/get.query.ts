import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { canViewDraft, SecurityRuleGrantee } from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { DraftRepo } from '~/server/database'

const securityCheck = async (user: SecurityRuleGrantee, input: IdInput) => {
  const draft = await DraftRepo.findUniqueOrThrow(user, {
    where: { id: input.id }
  })
  return canViewDraft(user, draft)
}

const handler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const draft = await DraftRepo.findUniqueOrThrow(user, {
    where: { id }
  })

  return draft
}

export const getBeneficiaryDraftQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
