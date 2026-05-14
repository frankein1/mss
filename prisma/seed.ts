/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'
import {
  fixtureStructures,
  fixturesDataInclusionStructures,
  fixturesDataInclusionStructuresV1,
  fixturesPartnerOrganizations,
  fixturesPartnerOrganizationContacts,
  fixturesSocialSupportSubjects,
  fixturesUsers,
  fixturesCGUHistory,
  fixturesFamilyFiles,
  fixturesBeneficiaries,
  fixturesBeneficiaryRelatives,
  fixturesSocialSupports,
  fixturesBudgets,
  fixturesBudgetIncomes,
  fixturesBudgetExpenses,
  fixturesWorkshopNames,
  fixturesWorkshops,
  fixturesWorkshopExternalAttendees,
  fixturesWorkshopAttendees
} from './fixtures'
import { ministers } from './ministers'

const prismaClient = new PrismaClient()

function loadFixtureStructure() {
  console.log('🏛 Structure...')

  return prismaClient.structure.createMany({
    data: fixtureStructures,
    skipDuplicates: true
  })
}

function loadFixturesSocialSupportSubjects() {
  console.log('🔷 Social support subjects...')

  return prismaClient.socialSupportSubject.createMany({
    data: fixturesSocialSupportSubjects,
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

function loadFixturesCGUHistory() {
  console.log('👩‍⚖️ CGU History for users...')

  return prismaClient.cGUHistory.createMany({
    data: fixturesCGUHistory,
    skipDuplicates: true
  })
}

function loadFixturesFamilyFiles() {
  console.log('👨‍👩‍👧‍👧 Family Files...')

  // Use upsert instead of createMany as createMany does not allow *-to-many relations to be initialized
  return fixturesFamilyFiles.map(({ id, ...data }) => {
    return prismaClient.familyFile.upsert({
      create: { id, ...data },
      where: { id },
      update: {}
    })
  })
}

function loadFixturesBeneficiaries() {
  console.log('👥 Beneficiaries...')

  // Use upsert instead of createMany as createMany does not allow *-to-many relations to be initialized
  return fixturesBeneficiaries.map(({ id, ...data }) => {
    return prismaClient.beneficiary.upsert({
      create: { id, ...data },
      where: { id },
      update: {}
    })
  })
}

function loadFixturesSocialSupports() {
  console.log('🤝 Social supports...')

  // Use upsert instead of createMany as createMany does not allow *-to-many relations to be initialized
  return fixturesSocialSupports.map(({ id, ...data }) => {
    return prismaClient.socialSupport.upsert({
      create: { id, ...data },
      where: { id },
      update: {}
    })
  })
}

function loadFixturesBeneficiaryRelatives() {
  console.log('🫂 Beneficiary Relatives...')

  return prismaClient.beneficiaryRelative.createMany({
    data: fixturesBeneficiaryRelatives,
    skipDuplicates: true
  })
}

function loadFixturesBudgets() {
  console.log('📊 Budgets...')

  return prismaClient.budget.createMany({
    data: fixturesBudgets,
    skipDuplicates: true
  })
}

function loadFixturesBudgetIncomes() {
  console.log('💰 Budget Incomes...')

  // Use upsert instead of createMany as createMany does not allow *-to-many relations to be initialized
  return fixturesBudgetIncomes.map(item => {
    return prismaClient.budgetIncome.upsert({
      create: item,
      where: { id: item.id },
      update: {}
    })
  })
}

function loadFixturesBudgetExpenses() {
  console.log('💸 Budget Expenses...')

  // Use upsert instead of createMany as createMany does not allow *-to-many relations to be initialized
  return fixturesBudgetExpenses.map(item => {
    return prismaClient.budgetExpenses.upsert({
      create: item,
      where: { id: item.id },
      update: {}
    })
  })
}

function loadFixturesDataInclusionStructures() {
  console.log('🗂️ Data Inclusion Structures (v0)...')

  return prismaClient.dataInclusionStructure.createMany({
    data: fixturesDataInclusionStructures,
    skipDuplicates: true
  })
}

function loadFixturesDataInclusionStructuresV1() {
  console.log('🗂️ Data Inclusion Structures (v1)...')

  return prismaClient.dataInclusionStructureV1.createMany({
    data: fixturesDataInclusionStructuresV1,
    skipDuplicates: true
  })
}

function loadFixturesPartnerOrganizations() {
  console.log('🏙️ Partner Organizations...')

  return prismaClient.partnerOrganization.createMany({
    data: fixturesPartnerOrganizations,
    skipDuplicates: true
  })
}

function loadFixturesPartnerOrganizationContacts() {
  console.log('🕴️ Partner Organization Contacts...')

  return prismaClient.partnerOrganizationContact.createMany({
    data: fixturesPartnerOrganizationContacts,
    skipDuplicates: true
  })
}

function loadWorkshopNames() {
  console.log('📑 Workshop names...')

  return prismaClient.workshopName.createMany({
    data: fixturesWorkshopNames,
    skipDuplicates: true
  })
}

function loadWorkshops() {
  console.log('👩‍🏫 Workshops...')

  return prismaClient.workshop.createMany({
    data: fixturesWorkshops,
    skipDuplicates: true
  })
}

function loadWorkshopExternalAttendees() {
  console.log('🥷 Workshops external attendees...')

  return prismaClient.workshopExternalAttendee.createMany({
    data: fixturesWorkshopExternalAttendees,
    skipDuplicates: true
  })
}

function loadWorkshopAttendees() {
  console.log('🕺 Workshops attendees...')

  return prismaClient.workshopAttendee.createMany({
    data: fixturesWorkshopAttendees,
    skipDuplicates: true
  })
}

function createMinister() {
  console.log('👑 Ministers...')

  return prismaClient.ministerEntity.createManyAndReturn({
    data: ministers,
    skipDuplicates: true,
    select: { id: true }
  })
}

function loadFixtures() {
  return [
    loadFixtureStructure(),
    loadFixturesSocialSupportSubjects(),
    loadFixturesUsers(),
    loadFixturesCGUHistory(),
    ...loadFixturesFamilyFiles(),
    ...loadFixturesBeneficiaries(),
    loadFixturesDataInclusionStructures(),
    loadFixturesDataInclusionStructuresV1(),
    loadFixturesPartnerOrganizations(),
    loadFixturesPartnerOrganizationContacts(),
    ...loadFixturesSocialSupports(),
    loadFixturesBeneficiaryRelatives(),
    loadFixturesBudgets(),
    ...loadFixturesBudgetIncomes(),
    ...loadFixturesBudgetExpenses(),
    loadWorkshopNames(),
    loadWorkshops(),
    loadWorkshopExternalAttendees(),
    loadWorkshopAttendees(),
    createMinister()
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
