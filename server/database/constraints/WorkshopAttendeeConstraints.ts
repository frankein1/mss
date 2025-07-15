import { Prisma } from '@prisma/client'
import { WorkshopConstraints } from './WorkshopConstraints'
import { SecurityRuleGrantee } from '~/server/security'
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
      beneficiary: {
        familyFile: { referents: { some: { id: user.id } } }
      }
    })
  }
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
  create,
  update: get,
  delete: get
}
