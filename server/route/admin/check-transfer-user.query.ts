import { createQuery } from '~~/server/route'
import type { IdInput } from '~~/server/schema'
import { idSchema } from '~~/server/schema'
import { StructureRepo, UserRepo } from '~~/server/database'
import type { AdminContext } from '~~/server/trpc'
import { UserRole } from '@prisma/client'

const adminHandler = async ({
  ctx,
  input
}: {
  ctx: AdminContext
  input: IdInput
}) => {
  const userInfo = await UserRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.id },
    select: {
      structure: {
        select: {
          users: {
            select: { id: true, role: true }
          }
        }
      },
      _count: { select: { referentFor: true } }
    }
  })
  const userRole = userInfo.structure?.users.find(u => (u.id = input.id))?.role
  const nStructureManagers = (userInfo.structure?.users || []).filter(
    u => u.role === UserRole.StructureManager
  ).length

  return {
    nBeneficiaries: userInfo._count.referentFor,
    isLastStructureManager:
      userRole == UserRole.StructureManager && nStructureManagers <= 1
  }
}

export const checkTransferUser = createQuery({
  inputValidation: idSchema,
  adminHandler
})
