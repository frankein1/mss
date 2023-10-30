import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { SecurityRuleGrantee, canDeleteDraft } from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { DraftRepo } from '~/server/database'

const securityCheck = async (user: SecurityRuleGrantee, input: IdInput) => {
  const draft = await DraftRepo.findUniqueOrThrow(user, {
    where: {
      id: input.id
    }
  })

  return canDeleteDraft(user, draft)
}

const handler = async ({
  input,
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  await DraftRepo.prisma.delete({
    where: { id: input.id }
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.DELETE,
    object: 'Draft',
    objectId: input.id
  })
}

export const deleteBeneficiaryDraftMutation = createMutation({
  securityCheck,
  handler,
  inputValidation: idSchema
})
