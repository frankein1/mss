import { UserActivityType } from '@prisma/client'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { BeneficiaryService } from '~/server/services'
import { createMutation } from '~/server/route'
import {
  AddFamilyFileMemberInput,
  addFamilyFileMemberSchema
} from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'

const securityCheck = AllowSecurityCheck

const handler = ({
  input,
  ctx
}: {
  input: AddFamilyFileMemberInput
  ctx: ProtectedAppContext
}) => {
  return BeneficiaryService.addMemberToFamilyFile({
    ctx,
    input
  })
}

export const addFamilyFileMemberMutation = createMutation({
  inputValidation: addFamilyFileMemberSchema,
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
