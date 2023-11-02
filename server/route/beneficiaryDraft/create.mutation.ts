import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  CreateBeneficiaryInput,
  createBeneficiarySchema
} from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { DraftRepo } from '~/server/database'

const handler = async ({
  input,
  ctx: { user, structure }
}: {
  input: CreateBeneficiaryInput
  ctx: ProtectedAppContext
}) => {
  const beneficiaryDraft = await DraftRepo.prisma.create({
    data: {
      structureId: structure.id,
      createdById: user.id,
      content: { general: input }
    }
  })

  return { id: beneficiaryDraft.id }
}

export const createBeneficiaryDraftMutation = createMutation({
  inputValidation: createBeneficiarySchema,
  handler,
  securityCheck: AllowSecurityCheck,
  auditLog: {
    key: 'beneficiaryDraft.create',
    target: 'Draft',
    targetId: ({ routeResult }) => {
      return routeResult.id
    },
    action: UserActivityType.CREATE
  }
})
