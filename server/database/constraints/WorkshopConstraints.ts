import type { Prisma } from '~/prisma/generated/client'
import { TRPCError } from '@trpc/server'
import type { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

// For now, all users of a structure can see, edit, delete, create any workshop
// in the same structure.
const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.WorkshopWhereInput = {}
  if (isAdmin(user)) {
    return where
  }

  if (!user.structureId) {
    throw new Error('workshop-constraints: missing structure id')
  }

  Object.assign<Prisma.WorkshopWhereInput, Prisma.WorkshopWhereInput>(where, {
    structureId: user.structureId
  })
  return where
}

const create = (user: SecurityRuleGrantee) => {
  const data: Partial<Prisma.WorkshopCreateInput> = {}
  if (isAdmin(user)) {
    throw new TRPCError({
      code: 'NOT_IMPLEMENTED',
      message: 'workshop-constraints: create not implemented for admin'
    })
  }

  if (!user.structureId) {
    throw new Error('workshop-constraints: missing structure id')
  }

  Object.assign<
    Partial<Prisma.WorkshopCreateInput>,
    Partial<Prisma.WorkshopCreateInput>
  >(data, {
    createdBy: { connect: { id: user.id } },
    structure: { connect: { id: user.structureId } }
  })
  return data
}

export const WorkshopConstraints = {
  get,
  create,
  update: get,
  delete: get
}
