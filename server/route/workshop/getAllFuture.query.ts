import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { WorkshopService } from '~/server/services/workshop'

const securityCheck = AllowSecurityCheck

const handler = ({ ctx }: { ctx: ProtectedAppContext }) => {
  return WorkshopService.getAllFuture({ ctx })
}

export const getAllFutureQuery = createQuery({
  inputValidation: emptySchema,
  securityCheck,
  handler
})
