import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { BeneficiaryService } from '~/server/services'
import {
  CreateHostedEntourageMemberInput,
  createHostedEntourageMemberSchema
} from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const securityCheck = AllowSecurityCheck

const handler = ({
  input,
  ctx: _ctx
}: {
  input: CreateHostedEntourageMemberInput
  ctx: ProtectedAppContext
}) => BeneficiaryService.createHostedEntourageMember(input)

export const createHostedEntourageMemberMutation = createMutation({
  inputValidation: createHostedEntourageMemberSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.createHostedEntourageMember',
    target: 'Beneficiary',
    targetId: ({ ctx }) => {
      return ctx.user.id
    },
    action: UserActivityType.CREATE
  }
})
