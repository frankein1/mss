import { prismaClient } from '~/server/prisma'
import { beforeAll, afterAll, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole,
  fixturesBeneficiaries
} from '~/prisma/fixtures'
import { faker } from '@faker-js/faker'
import type { Prisma } from '@prisma/client'

let manyWorkshopIds: string[]
let startDate: Date

const createManyWorkshops = async () => {
  const createdById = fixturesUsers[FixtureUserRole.StructureManager].id
  const structureId = fixtureStructures[FixtureStructure.Test].id
  const data: Prisma.WorkshopCreateManyInput[] = []
  const name = await prismaClient.workshopName.create({
    data: {
      name: faker.lorem.words(),
      structureId,
      createdById
    }
  })
  for (let i = 0; i < 10; i++) {
    data.push({
      date: new Date(),
      createdById: createdById,
      structureId: structureId,
      workshopNameId: name.id
    })
  }
  const workshops = await prismaClient.workshop.createManyAndReturn({
    select: { id: true },
    data: data
  })
  return workshops
}

beforeAll(async () => {
  const manyWorkshops = await createManyWorkshops()
  manyWorkshopIds = manyWorkshops.map(w => w.id)
  startDate = new Date()
})

afterAll(async () => {
  await resetDatabase(manyWorkshopIds)
  const endDate = new Date()
  if (startDate) {
    console.log(endDate.getTime() - startDate.getTime())
  }
})

test('Workshops – Register 10 beneficiaries in 10 workshops', async ({
  trpc
}) => {
  const beneficiaryIds = fixturesBeneficiaries.slice(0, 10).map(b => b.id)
  const attendees = await trpc.structureManager.workshop.registerBeneficiaries({
    workshopIds: manyWorkshopIds,
    beneficiaryIds: beneficiaryIds
  })
  expect(attendees).toHaveLength(100)
}, 10000)

const resetDatabase = async (manyWorkshopIds: string[]) => {
  await prismaClient.workshop.deleteMany({
    where: {
      id: {
        in: manyWorkshopIds
      }
    }
  })
  await prismaClient.workshopAttendee.deleteMany({
    where: {
      workshopId: {
        in: manyWorkshopIds
      }
    }
  })
  await prismaClient.workshopName.deleteMany({
    where: {
      workshops: {
        every: {
          id: {
            in: manyWorkshopIds
          }
        }
      }
    }
  })
}
