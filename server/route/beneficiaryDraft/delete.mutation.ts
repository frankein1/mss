import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleGrantee } from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { DraftRepo } from '~/server/database'
import { isCreator } from '~/server/security/rules/helpers'

const securityCheck = async (user: SecurityRuleGrantee, input: IdInput) => {
  const draft = await DraftRepo.findUniqueOrThrow(user, {
    where: {
      id: input.id
    }
  })

  return isCreator(user, draft)
}

const handler = async ({
  input,
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  await DraftRepo.delete(user, {
    where: { id: input.id }
  })
}

export const deleteBeneficiaryDraftMutation = createMutation({
  securityCheck,
  handler,
  inputValidation: idSchema,
  auditLog: {
    key: 'beneficiaryDraft.delete',
    target: 'Draft',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.DELETE
  }
})
