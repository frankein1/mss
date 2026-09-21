import { UserRole } from '@prisma/client'
import { createQuery } from '~~/server/route'
import type { AdminContext } from '~~/server/trpc'
import { idSchema } from '~~/server/schema'
import { UserRepo } from '~~/server/database'
import { prismaClient } from '~~/server/prisma'
import { parseStructureTransferHistory } from '~~/server/schema/user/structureTransferHistory.schema'
import { userRoleKeys } from '~~/client/options'

const adminHandler = async ({
  ctx,
  input: { id }
}: {
  ctx: AdminContext
  input: { id: string }
}) => {
  const user = await UserRepo.findUniqueOrThrow(ctx.user, {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      structureId: true,
      structure: { select: { name: true } },
      role: true,
      status: true,
      aidantConnectAuthorisation: true,
      structureTransferHistory: true
    },
    where: { id, role: { not: UserRole.Administrator } }
  })

  const history = parseStructureTransferHistory(user.structureTransferHistory)

  let formerStructures: {
    structureName: string
    roleLabel: string
    leftAt: Date
    disabled: boolean
  }[] = []

  if (history.length > 0) {
    const structureIds = [...new Set(history.map(e => e.structureId))]
    const structures = await prismaClient.structure.findMany({
      where: { id: { in: structureIds } },
      select: { id: true, name: true, disabled: true }
    })
    const structureMap = new Map(structures.map(s => [s.id, s]))

    formerStructures = history
      .map(entry => {
        const structure = structureMap.get(entry.structureId)
        let structureName: string
        let disabled = false
        if (!structure) {
          structureName = 'Structure inconnue'
        } else if (structure.disabled || structure.name === '') {
          structureName = 'Structure désactivée'
          disabled = true
        } else {
          structureName = structure.name
        }
        return {
          structureName,
          roleLabel: userRoleKeys.value(entry.role) ?? entry.role,
          leftAt: entry.leftAt,
          disabled
        }
      })
      .sort((a, b) => b.leftAt.getTime() - a.leftAt.getTime())
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    structureId: user.structureId,
    structure: user.structure,
    role: user.role,
    status: user.status,
    aidantConnectAuthorisation: user.aidantConnectAuthorisation,
    formerStructures
  }
}

export const getUser = createQuery({
  inputValidation: idSchema,
  adminHandler
})
