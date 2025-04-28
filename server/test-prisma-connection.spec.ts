import { describe, it, afterAll } from 'vitest'
import { prismaClient } from '~/server/prisma'
import { generateFileNumber } from '~/utils/generateFileNumber'
import { createFamilyFile, createBeneficiary } from '~/test/server/fixtures'
import {
  fixturesUsers,
  FixtureUserRole,
  fixtureStructures
} from '~/prisma/fixtures'

it(
  'should apply conditionally prisma queries',
  async () => {
    const date = new Date()
    const familyFile = await createFamilyFile(
      date,
      fixtureStructures[0].id,
      fixturesUsers[FixtureUserRole.StructureManager].id,
      fixturesUsers[FixtureUserRole.StructureManager].id
    )

    const beneficiary1 = await createBeneficiary(
      date,
      familyFile.id,
      fixtureStructures[0].id,
      fixturesUsers[FixtureUserRole.StructureManager].id,
      generateFileNumber()
    )

    const beneficiary2 = await createBeneficiary(
      date,
      familyFile.id,
      fixtureStructures[0].id,
      fixturesUsers[FixtureUserRole.StructureManager].id,
      generateFileNumber()
    )

    // ------

    const deleteBeneficiary1 = prismaClient.beneficiary.delete({
      where: { id: beneficiary1.id }
    })

    const deleteBeneficiary2 = prismaClient.beneficiary.delete({
      where: { id: beneficiary2.id }
    })

    await new Promise(r => setTimeout(r, 3000))

    console.log('beneficiary1', beneficiary1.id)
    console.log('beneficiary2', beneficiary2.id)
    await prismaClient.$transaction([deleteBeneficiary2])

    await new Promise(r => setTimeout(r, 3000))

    const deleteFamilyFile = prismaClient.familyFile.delete({
      where: { id: familyFile.id }
    })

    await new Promise(r => setTimeout(r, 3000))

    const ben1 = await prismaClient.beneficiary.findFirst({
      where: { id: beneficiary1.id }
    })
    const ff = await prismaClient.familyFile.findFirst({
      where: { id: familyFile.id }
    })

    console.log('beneficiary 1 still exists', ben1)
    console.log('family file 1 still exists', ff)
  },
  { timeout: 15000 }
)
