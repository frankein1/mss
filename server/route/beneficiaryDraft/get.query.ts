import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { idSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { DraftRepo } from '~/server/repository'

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
  securityCheck: AllowSecurityCheck,
  handler
})
