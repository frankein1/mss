import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { idSchema } from '~/server/schema'
import { DraftRepo } from '~/server/repository'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = async ({
  input,
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  await DraftRepo.deleteEntity(user, {
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
  securityCheck: AllowSecurityCheck,
  handler,
  inputValidation: idSchema
})
