import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  CreateBeneficiaryInput,
  createBeneficiarySchema
} from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = async ({
  input,
  ctx: { user, structure }
}: {
  input: CreateBeneficiaryInput
  ctx: ProtectedAppContext
}) => {
  const beneficiaryDraft = await prismaClient.draft.create({
    data: {
      structureId: structure.id,
      createdById: user.id,
      content: { general: input }
    }
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.CREATE,
    object: 'Draft',
    objectId: beneficiaryDraft.id
  })

  return { id: beneficiaryDraft.id }
}

export const createBeneficiaryDraftMutation = createMutation({
  inputValidation: createBeneficiarySchema,
  handler,
  securityCheck: AllowSecurityCheck
})
