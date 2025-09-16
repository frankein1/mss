import type { Prisma } from '@prisma/client'
import { WorkshopConstraints } from './WorkshopConstraints'
import type { SecurityRuleGrantee } from '~/server/security'
import { isAdmin, isReferent } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.WorkshopAttendeeWhereInput = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign<
    Prisma.WorkshopAttendeeWhereInput,
    Prisma.WorkshopAttendeeWhereInput
  >(where, {
    workshop: WorkshopConstraints.get(user)
  })

  if (isReferent(user)) {
    Object.assign<
      Prisma.WorkshopAttendeeWhereInput,
      Prisma.WorkshopAttendeeWhereInput
    >(where, {
      OR: [
        {
          type: { not: 'Beneficiary' }
        },
        {
          beneficiary: {
            familyFile: { referents: { some: { id: user.id } } }
          }
        }
      ]
    })
  }
  return where
}

const count = (user: SecurityRuleGrantee) => {
  const where: Prisma.WorkshopAttendeeCountArgs['where'] = {}
  if (isAdmin(user)) {
    return where
  }
  // All roles can count attendees
  Object.assign(where, {
    workshop: {
      structureId: user.structureId
    }
  })
  return where
}

const create = (user: SecurityRuleGrantee) => {
  const data: Partial<Prisma.WorkshopAttendeeCreateInput> = {}
  if (isAdmin(user)) {
    throw new Error(
      'workshop-attendee-constraints: create not implemented for admin'
    )
  }
  return data
}

export const WorkshopAttendeeConstraints = {
  get,
  count,
  create,
  update: get,
  delete: get
}
