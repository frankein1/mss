import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { BeneficiaryService } from '~/server/services'
import {
  CreateHouseholdMemberInput,
  createHouseholdMemberSchema
} from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const securityCheck = AllowSecurityCheck

const handler = ({
  input,
  ctx: _ctx
}: {
  input: CreateHouseholdMemberInput
  ctx: ProtectedAppContext
}) => BeneficiaryService.createHouseholdMember(input)

export const createTaxHouseholdMemberMutation = createMutation({
  inputValidation: createHouseholdMemberSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.createHouseholdMember',
    target: 'Beneficiary',
    targetId: ({ ctx }) => {
      return ctx.user.id
    },
    action: UserActivityType.CREATE
  }
})
