import type { Prisma } from '@prisma/client'
import { prismaClient } from '~~/server/prisma'

export async function createStructure(
  date: Date,
  overrides?: Partial<Prisma.StructureCreateInput>
) {
  return await prismaClient.structure.create({
    select: {
      id: true
    },
    data: {
      created: date,
      updated: date,
      type: 'Ccas',
      name: 'Structure pour tests unitaires',
      zipcode: '69007',
      city: 'Lyon',
      address: '77 quai monge',
      phone: '06 06 06 06 06',
      email: 'structure-unit-tests@example.com',
      inhabitantsNumber: '56845',
      inseeCode: '69654',
      siret: '123598752215',
      dpoFirstName: 'Mélissa',
      dpoLastName: 'Dupont',
      dpoEmail: 'melissa.dupont@example.com',
      lastActivity: date,
      lastAccess: date,
      disabled: false,
      deactivationAlertEmail: 0,
      deactivationAlertEmailDate: null,
      externalRdvspActive: false,
      externalRdvspId: null,
      ...overrides
    }
  })
}
