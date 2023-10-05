import { createQuery } from '~/server/request'
import { ProtectedAppContext, notfoundError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { canViewDraft } from '~/server/security/rules'
import { idSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = async ({
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const draft = await prismaClient.draft.findUnique({
    where: { id }
  })

  if (!draft || !canViewDraft(user, draft)) {
    throw notfoundError()
  }

  return draft
}

export const getBeneficiaryDraftQuery = createQuery({
  inputValidation: idSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
