import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { emptySchema } from '~/server/schema'
import { InstructorOrganizationRepo } from '~/server/repository'

const handler = async ({ ctx: { user } }: { ctx: ProtectedAppContext }) => {
  return await InstructorOrganizationRepo.findMany(user, {
    where: {
      structureId: user.structureId
    },
    orderBy: [{ name: 'asc' }]
  })
}

export const getInstructorOrganizationQuery = createQuery({
  handler,
  securityCheck: AllowSecurityCheck,
  inputValidation: emptySchema
})
