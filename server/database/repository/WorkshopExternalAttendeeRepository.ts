import type { Prisma } from '@prisma/client'
import { WorkshopExternalAttendeeConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import type { SecurityRuleGrantee } from '~/server/security'

function deleteWorkshopExternalAttendee(
  user: SecurityRuleGrantee,
  params: Prisma.WorkshopExternalAttendeeDeleteArgs
) {
  appendConstraints(user, params, WorkshopExternalAttendeeConstraints.delete)
  return prismaClient.workshopExternalAttendee.delete(params)
}

export const WorkshopExternalAttendeeRepo = {
  delete: deleteWorkshopExternalAttendee,
  prisma: { groupBy: prismaClient.workshopExternalAttendee.groupBy }
}
