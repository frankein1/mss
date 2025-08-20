import type { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import type { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

// For now, all users of a structure can see, edit, delete, create any workshop
// in the same structure.
// TODO: make sure that's what we want
const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.WorkshopWhereInput = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign(where, {
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
  Object.assign(data, {
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
