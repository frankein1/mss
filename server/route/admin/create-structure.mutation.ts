import { createMutation } from '~/server/route'
import { prismaClient } from '~/server/prisma'
import {
  AdminCreateStructureInput,
  adminCreateStructureSchema
} from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { AdminContext } from '~/server/trpc/createRouter'

const adminHandler = async ({
  ctx: _ctx,
  input
}: {
  ctx: AdminContext
  input: AdminCreateStructureInput
}) => {
  const createdStructure = await prismaClient.structure.create({
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
