import { ProtectedAppContext, notfoundError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { canViewDraft } from '~/server/security/rules'

export const getDraftHandler = async ({
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
