import { afterEach, describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { prismaClient } from '~/server/prisma'
import { v4 } from 'uuid'

const structureId = fixtureStructures[FixtureStructure.Test].id
const managerId = fixturesUsers[FixtureUserRole.StructureManager].id
const referentId = fixturesUsers[FixtureUserRole.Referent].id

const nameIds: string[] = []
const beneficiaryIds: string[] = []
const familyFileIds: string[] = []
const subjectIds: string[] = []

afterEach(async () => {
  await prismaClient.beneficiary.deleteMany({
    where: { id: { in: beneficiaryIds } }
  })
  await prismaClient.familyFile.deleteMany({
    where: { id: { in: familyFileIds } }
  })
  await prismaClient.supportProgramName.deleteMany({
    where: { id: { in: nameIds } }
  })
  await prismaClient.socialSupportSubject.deleteMany({
    where: { id: { in: subjectIds } }
  })
  nameIds.length = 0
  beneficiaryIds.length = 0
  familyFileIds.length = 0
  subjectIds.length = 0
})

describe('SupportProgram - Delete Name - Authorizations', () => {
  test('A SocialWorker cannot delete a support program name', async ({
    trpc
  }) => {
    const { id } = await prismaClient.supportProgramName.create({
      data: { name: 'UDN-Auth-SW', structureId, createdById: managerId },
      select: { id: true }
    })
    nameIds.push(id)

    await expect(
      trpc.socialWorker.supportProgram.deleteName({ id })
    ).rejects.toThrowError(/not allowed to access route/i)
  })

  test('A StructureManager cannot delete a support program name from another structure', async ({
    trpc
  }) => {
    const { id } = await prismaClient.supportProgramName.create({
      data: { name: 'UDN-Auth-Cross', structureId, createdById: managerId },
      select: { id: true }
    })
    nameIds.push(id)

    await expect(
      trpc.structureManagerMinistere.supportProgram.deleteName({ id })
    ).rejects.toThrowError(/supportProgramName[\s\S]*?no record/im)
  })
})

describe('SupportProgram - Delete Name - Cascade Effects', () => {
  test('A StructureManager can delete an unused support program name', async ({
    trpc
  }) => {
    const { id } = await prismaClient.supportProgramName.create({
      data: { name: 'UDN-Unused', structureId, createdById: managerId },
      select: { id: true }
    })
    nameIds.push(id)

    await trpc.structureManager.supportProgram.deleteName({ id })

    const record = await prismaClient.supportProgramName.findUnique({
      where: { id }
    })
    expect(record).toBeNull()
  })

  test('Deleting a name cascades to linked SupportPrograms', async ({
    trpc
  }) => {
    const familyFile = await prismaClient.familyFile.create({
      data: {
        structure: { connect: { id: structureId } },
        referents: { connect: [{ id: referentId }] }
      }
    })
    familyFileIds.push(familyFile.id)

    const beneficiary = await prismaClient.beneficiary.create({
      data: {
        familyFile: { connect: { id: familyFile.id } },
        structure: { connect: { id: structureId } },
        createdBy: { connect: { id: managerId } },
        fileNumber: `UDN-CASCADE-${v4()}`,
        status: 'Active'
      }
    })
    beneficiaryIds.push(beneficiary.id)

    const { id: nameId } = await prismaClient.supportProgramName.create({
      data: {
        name: `UDN-CascadeName-${v4()}`,
        structureId,
        createdById: managerId
      },
      select: { id: true }
    })
    nameIds.push(nameId)

    const { id: programId } = await prismaClient.supportProgram.create({
      data: {
        id: v4(),
        beneficiary: { connect: { id: beneficiary.id } },
        supportProgramName: { connect: { id: nameId } }
      },
      select: { id: true }
    })

    await trpc.structureManager.supportProgram.deleteName({ id: nameId })

    const program = await prismaClient.supportProgram.findUnique({
      where: { id: programId }
    })
    expect(program).toBeNull()
  })

  test('Deleting a name sets supportProgramId to null on linked followup social supports', async ({
    trpc
  }) => {
    const familyFile = await prismaClient.familyFile.create({
      data: {
        structure: { connect: { id: structureId } },
        referents: { connect: [{ id: referentId }] }
      }
    })
    familyFileIds.push(familyFile.id)

    const beneficiary = await prismaClient.beneficiary.create({
      data: {
        familyFile: { connect: { id: familyFile.id } },
        structure: { connect: { id: structureId } },
        createdBy: { connect: { id: managerId } },
        fileNumber: `UDN-FOLLOWUP-${v4()}`,
        status: 'Active'
      }
    })
    beneficiaryIds.push(beneficiary.id)

    const { id: nameId } = await prismaClient.supportProgramName.create({
      data: {
        name: `UDN-FollowupName-${v4()}`,
        structureId,
        createdById: managerId
      },
      select: { id: true }
    })
    nameIds.push(nameId)

    const { id: programId } = await prismaClient.supportProgram.create({
      data: {
        id: v4(),
        beneficiary: { connect: { id: beneficiary.id } },
        supportProgramName: { connect: { id: nameId } }
      },
      select: { id: true }
    })

    const socialSupport = await prismaClient.socialSupport.create({
      data: {
        date: new Date(),
        structure: { connect: { id: structureId } },
        familyFile: { connect: { id: familyFile.id } },
        beneficiary: { connect: { id: beneficiary.id } },
        createdBy: { connect: { id: managerId } },
        lastUpdatedBy: { connect: { id: managerId } },
        status: 'InProgress',
        socialSupportType: 'Followup',
        supportProgram: { connect: { id: programId } },
        followup: {
          create: {
            medium: 'PlannedInPerson'
          }
        }
      }
    })

    await trpc.structureManager.supportProgram.deleteName({ id: nameId })

    const updatedSocialSupport = await prismaClient.socialSupport.findUnique({
      where: { id: socialSupport.id }
    })
    expect(updatedSocialSupport).not.toBeNull()
    expect(updatedSocialSupport?.supportProgramId).toBeNull()
  })

  test('Deleting a name sets supportProgramId to null on linked help request social supports', async ({
    trpc
  }) => {
    const familyFile = await prismaClient.familyFile.create({
      data: {
        structure: { connect: { id: structureId } },
        referents: { connect: [{ id: referentId }] }
      }
    })
    familyFileIds.push(familyFile.id)

    const beneficiary = await prismaClient.beneficiary.create({
      data: {
        familyFile: { connect: { id: familyFile.id } },
        structure: { connect: { id: structureId } },
        createdBy: { connect: { id: managerId } },
        fileNumber: `UDN-HELPREQ-${v4()}`,
        status: 'Active'
      }
    })
    beneficiaryIds.push(beneficiary.id)

    const { id: nameId } = await prismaClient.supportProgramName.create({
      data: {
        name: `UDN-HelpReqName-${v4()}`,
        structureId,
        createdById: managerId
      },
      select: { id: true }
    })
    nameIds.push(nameId)

    const { id: programId } = await prismaClient.supportProgram.create({
      data: {
        id: v4(),
        beneficiary: { connect: { id: beneficiary.id } },
        supportProgramName: { connect: { id: nameId } }
      },
      select: { id: true }
    })

    const subjectId = crypto.randomUUID()
    subjectIds.push(subjectId)

    const socialSupport = await prismaClient.socialSupport.create({
      data: {
        date: new Date(),
        structure: { connect: { id: structureId } },
        familyFile: { connect: { id: familyFile.id } },
        beneficiary: { connect: { id: beneficiary.id } },
        createdBy: { connect: { id: managerId } },
        lastUpdatedBy: { connect: { id: managerId } },
        status: 'InProgress',
        socialSupportType: 'HelpRequest',
        supportProgram: { connect: { id: programId } },
        fileInstruction: {
          create: {
            type: 'Financial',
            externalStructure: false,
            helpRequest: {
              create: {
                id: crypto.randomUUID(),
                financialSupport: true,
                subject: {
                  create: {
                    id: subjectId,
                    name: 'Test subject',
                    ownedByStructureId: structureId
                  }
                }
              }
            }
          }
        }
      }
    })

    await trpc.structureManager.supportProgram.deleteName({ id: nameId })

    const updatedSocialSupport = await prismaClient.socialSupport.findUnique({
      where: { id: socialSupport.id }
    })
    expect(updatedSocialSupport).not.toBeNull()
    expect(updatedSocialSupport?.supportProgramId).toBeNull()
  })
})
