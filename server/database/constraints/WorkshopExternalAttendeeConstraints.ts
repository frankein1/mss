import type { Prisma } from '@prisma/client'
import { WorkshopConstraints } from './WorkshopConstraints'
import type { SecurityRuleGrantee } from '~~/server/security'
import { isAdmin } from '~~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.WorkshopExternalAttendeeWhereInput = {}
  if (isAdmin(user)) {
    return where
  }
  // The user.structureId check is performed in WorkshopConstraints
  Object.assign<
    Prisma.WorkshopExternalAttendeeWhereInput,
    Prisma.WorkshopExternalAttendeeWhereInput
  >(where, {
    workshopAttendee: {
      workshop: WorkshopConstraints.get(user)
    }
  })

  // All roles can manipulate External Attendees, so there
  // is not specificity related to the Referent here

  return where
}

export const WorkshopExternalAttendeeConstraints = {
  get,
  delete: get
}
