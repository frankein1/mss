import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { FileInstructionService } from '~/server/services'

const handler = ({ ctx }: { ctx: ProtectedAppContext }) => {
  return FileInstructionService.getOngoing({ ctx })
}

export const getOngoing = createQuery({
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck,
  handler
})
