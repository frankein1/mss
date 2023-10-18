import { createMutation } from '~/server/route'
import {
  AdminCreateStructureInput,
  adminCreateStructureSchema
} from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { AdminContext } from '~/server/trpc/createRouter'
import { StructureRepo } from '~/server/database'

const adminHandler = async ({
  ctx: { user: _user },
  input
}: {
  ctx: AdminContext
  input: AdminCreateStructureInput
}) => {
  const createdStructure = await StructureRepo.prisma.create({
    data: input,
    include: {
      followupTypes: {
        include: {
          _count: {
            select: { followups: true, helpRequests: true }
          }
        }
      }
    }
  })

  return createdStructure
}

export const createAdminStructureMutation = createMutation({
  inputValidation: adminCreateStructureSchema,
  securityCheck: AllowSecurityCheck,
  adminHandler
})
