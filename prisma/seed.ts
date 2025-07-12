/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'
import {
  fixtureStructures,
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
  fixturesBudgetExpenses
} from './fixtures'

const prismaClient = new PrismaClient()

function loadFixtureStructure() {
  console.info('🏛 Structure...')

  return prismaClient.structure.createMany({
    data: fixtureStructures,
    skipDuplicates: true
  })
}

function loadFixturesSocialSupportSubjects() {
  console.info('🔷 Social support subjects...')

  return prismaClient.socialSupportSubject.createMany({
    data: fixturesSocialSupportSubjects,
    skipDuplicates: true
  })
}

function loadFixturesUsers() {
  console.info('👤 Users...')

  return prismaClient.user.createMany({
    data: fixturesUsers,
    skipDuplicates: true
  })
}

function loadFixturesCGUHistory() {
  console.info('👩‍⚖️ CGU History for users...')

  return prismaClient.cGUHistory.createMany({
    data: fixturesCGUHistory,
    skipDuplicates: true
  })
}

function loadFixturesFamilyFiles() {
  console.info('👨‍👩‍👧‍👧 Family Files...')

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
  console.info('👥 Beneficiaries...')

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
  console.info('🤝 Social supports...')

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
  console.info('🫂 Beneficiary Relatives...')

  return prismaClient.beneficiaryRelative.createMany({
    data: fixturesBeneficiaryRelatives,
    skipDuplicates: true
  })
}

function loadFixturesBudgets() {
  console.info('📊 Budgets...')

  return prismaClient.budget.createMany({
    data: fixturesBudgets,
    skipDuplicates: true
  })
}

function loadFixturesBudgetIncomes() {
  console.info('💰 Budget Incomes...')

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
  console.info('💸 Budget Expenses...')

  // Use upsert instead of createMany as createMany does not allow *-to-many relations to be initialized
  return fixturesBudgetExpenses.map(item => {
    return prismaClient.budgetExpenses.upsert({
      create: item,
      where: { id: item.id },
      update: {}
    })
  })
}

function loadFixturesPartnerOrganizations() {
  console.info('🏙️ Partner Organizations...')

  return prismaClient.partnerOrganization.createMany({
    data: fixturesPartnerOrganizations,
    skipDuplicates: true
  })
}

function loadFixturesPartnerOrganizationContacts() {
  console.info('🕴️ Partner Organization Contacts...')

  return prismaClient.partnerOrganizationContact.createMany({
    data: fixturesPartnerOrganizationContacts,
    skipDuplicates: true
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
    loadFixturesPartnerOrganizations(),
    loadFixturesPartnerOrganizationContacts(),
    ...loadFixturesSocialSupports(),
    loadFixturesBeneficiaryRelatives(),
    loadFixturesBudgets(),
    ...loadFixturesBudgetIncomes(),
    ...loadFixturesBudgetExpenses()
  ]
}

async function main() {
  console.info('⏱️ Loading fixtures...')

  await prismaClient.$transaction(loadFixtures())

  console.info('👍 Done!')
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
