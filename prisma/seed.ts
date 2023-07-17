/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'
import {
  fixtureStructure,
  fixturesFollowupTypes,
  fixturesUsers,
  fixturesBeneficiaries,
  fixturesFollowups,
  fixturesHelpRequests
} from './fixtures'

const prismaClient = new PrismaClient()

function loadFixtureStructure() {
  console.log('🏛 Structure...')

  return prismaClient.structure.createMany({
    data: fixtureStructure,
    skipDuplicates: true
  })
}

function loadFixturesFollowupTypes() {
  console.log('🔷 Follow-up types...')

  return prismaClient.followupType.createMany({
    data: fixturesFollowupTypes,
    skipDuplicates: true
  })
}

function loadFixturesUsers() {
  console.log('👤 Users...')

  return prismaClient.user.createMany({
    data: fixturesUsers,
    skipDuplicates: true
  })
}

function loadFixturesBeneficiaries() {
  console.log('👥 Beneficiaries...')

  return prismaClient.beneficiary.createMany({
    data: fixturesBeneficiaries,
    skipDuplicates: true
  })
}

function loadFixturesFollowups() {
  console.log('🤝 Followups...')

  return fixturesFollowups.map(({ id, ...data }) => {
    return prismaClient.followup.upsert({
      create: { id, ...data },
      where: { id },
      update: {}
    })
  })
}

function loadFixturesHelpRequests() {
  console.log('📇 Help requests...')

  return prismaClient.helpRequest.createMany({
    data: fixturesHelpRequests,
    skipDuplicates: true
  })
}

function loadFixtures() {
  return [
    loadFixtureStructure(),
    loadFixturesFollowupTypes(),
    loadFixturesUsers(),
    loadFixturesBeneficiaries(),
    ...loadFixturesFollowups(),
    loadFixturesHelpRequests()
  ]
}

async function main() {
  console.log('⏱️ Loading fixtures...')

  await prismaClient.$transaction(loadFixtures())

  console.log('👍 Done!')
}

main()
  .then(async () => {
    await prismaClient.$disconnect()
  })
  .catch(async e => {
    console.error(e)

    await prismaClient.$disconnect()

    process.exit(1)
  })
