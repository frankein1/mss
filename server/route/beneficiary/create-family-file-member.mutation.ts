import { UserActivityType } from '@prisma/client'
import { AllowSecurityCheck } from '~~/server/security/rules/types'
import { BeneficiaryService } from '~~/server/services'
import { createMutation } from '~~/server/route'
import type { CreateFamilyFileMemberInput } from '~~/server/schema'
import { createFamilyFileMemberSchema } from '~~/server/schema'
import type { ProtectedAppContext } from '~~/server/trpc'

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
    targetId: ({ routeResult }) => routeResult.id,
    action: UserActivityType.CREATE
  }
})
