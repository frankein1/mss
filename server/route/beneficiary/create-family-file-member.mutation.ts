import { UserActivityType } from '@prisma/client'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { BeneficiaryService } from '~/server/services'
import { createMutation } from '~/server/route'
import {
  CreateFamilyFileMemberInput,
  createFamilyFileMemberSchema
} from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'

const securityCheck = AllowSecurityCheck

const handler = ({
  input,
  ctx
}: {
  input: CreateFamilyFileMemberInput
  ctx: ProtectedAppContext
}) => {
  return BeneficiaryService.createFamilyFileMember({
    ctx,
    input
  })
}

export const createFamilyFileMemberMutation = createMutation({
  inputValidation: createFamilyFileMemberSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.create',
    target: 'Beneficiary',
    targetId: ({ ctx }) => {
      return ctx.user.id
    },
    action: UserActivityType.CREATE
  }
})
