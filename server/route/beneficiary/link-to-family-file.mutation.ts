import { UserActivityType } from '@prisma/client'
import { AllowSecurityCheck } from '~~/server/security/rules/types'
import { BeneficiaryService } from '~~/server/services'
import { createMutation } from '~~/server/route'
import type { LinkToFamilyFileInput } from '~~/server/schema'
import { linkToFamilyFileSchema } from '~~/server/schema'
import type { ProtectedAppContext } from '~~/server/trpc'

const securityCheck = AllowSecurityCheck

const handler = ({
  input,
  ctx
}: {
  input: LinkToFamilyFileInput
  ctx: ProtectedAppContext
}) => {
  return BeneficiaryService.linkToFamilyFile({
    ctx,
    input
  })
}

export const linkToFamilyFileMutation = createMutation({
  inputValidation: linkToFamilyFileSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.linkToFamilyFile',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.beneficiaryId
    },
    action: UserActivityType.UPDATE
  }
})
