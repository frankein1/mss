import { createMutation } from '../createRoute'
import type { ProtectedAppContext } from '~~/server/trpc'
import { emptySchema } from '~~/server/schema'
import { AllowSecurityCheck } from '~~/server/security/rules/types'
import { UserRepo } from '~~/server/database'

const handler = async ({ ctx }: { ctx: ProtectedAppContext }) => {
  const {
    public: { cguVersion }
  } = useRuntimeConfig()

  await UserRepo.prisma.update({
    where: { id: ctx.user.id },
    data: {
      CGUHistory: {
        create: {
          version: cguVersion
        }
      }
    }
  })

  return { cguVersion }
}

export const acceptCGUMutation = createMutation({
  handler,
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
