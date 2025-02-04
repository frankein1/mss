import { Prisma } from '@prisma/client'
import { AppointmentConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function update<T extends Prisma.AppointmentUpdateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.AppointmentUpdateArgs>
) {
  appendConstraints(user, params, AppointmentConstraints.update)
  return prismaClient.appointment.update(params)
}

export const AppointmentRepo = {
  update
}
