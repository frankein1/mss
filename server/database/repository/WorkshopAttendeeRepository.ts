import type { Prisma } from '@prisma/client'
import { WorkshopAttendeeConstraints } from '../constraints'
import {
  appendConstraints,
  appendCreateConstraints
} from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import type { SecurityRuleGrantee } from '~/server/security'

// READ

function findMany<T extends Prisma.WorkshopAttendeeFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.WorkshopAttendeeFindManyArgs>
) {
  appendConstraints(user, params, WorkshopAttendeeConstraints.get)
  return prismaClient.workshopAttendee.findMany(params)
}

function count(
  user: SecurityRuleGrantee,
  params: Prisma.WorkshopAttendeeCountArgs
) {
  appendConstraints(user, params, WorkshopAttendeeConstraints.count)
  return prismaClient.workshopAttendee.count(params)
}

function findUniqueOrThrow<
  T extends Prisma.WorkshopAttendeeFindUniqueOrThrowArgs
>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.WorkshopAttendeeFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, WorkshopAttendeeConstraints.get)
  return prismaClient.workshopAttendee.findUniqueOrThrow(params)
}

function deleteWorkshopAttendee(
  user: SecurityRuleGrantee,
  params: Prisma.WorkshopAttendeeDeleteArgs
) {
  appendConstraints(user, params, WorkshopAttendeeConstraints.delete)
  return prismaClient.workshopAttendee.delete(params)
}

function update<T extends Prisma.WorkshopAttendeeUpdateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.WorkshopAttendeeUpdateArgs>
) {
  appendConstraints(user, params, WorkshopAttendeeConstraints.update)
  return prismaClient.workshopAttendee.update(params)
}

function updateMany<T extends Prisma.WorkshopAttendeeUpdateManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.WorkshopAttendeeUpdateManyArgs>
) {
  appendConstraints(user, params, WorkshopAttendeeConstraints.update)
  return prismaClient.workshopAttendee.updateMany(params)
}

function create<T extends Prisma.WorkshopAttendeeCreateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.WorkshopAttendeeCreateArgs>
) {
  appendCreateConstraints(user, params, WorkshopAttendeeConstraints.create)
  return prismaClient.workshopAttendee.create(params)
}

export const WorkshopAttendeeRepo = {
  findMany,
  count,
  findUniqueOrThrow,
  delete: deleteWorkshopAttendee,
  update,
  updateMany,
  create
}
