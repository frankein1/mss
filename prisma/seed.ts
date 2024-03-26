/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'
import {
  fixtureStructure,
  fixturesSocialSupportSubjects,
  fixturesUsers,
  fixturesBeneficiaries,
  fixturesBeneficiaryRelatives,
  fixturesSocialSupports,
  fixturesBudgets,
  fixturesBudgetIncomes,
  fixturesBudgetExpenses
} from './fixtures'

const prismaClient = new PrismaClient()

function loadFixtureStructure() {
  console.log('🏛 Structure...')

  return prismaClient.structure.createMany({
    data: fixtureStructure,
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

  return prismaClient.budgetIncome.createMany({
    data: fixturesBudgetIncomes,
    skipDuplicates: true
  })
}

function loadFixturesBudgetExpenses() {
  console.log('💸 Budget Expenses...')

  return prismaClient.budgetExpenses.createMany({
    data: fixturesBudgetExpenses,
    skipDuplicates: true
  })
}

function loadFixtures() {
  return [
    loadFixtureStructure(),
    loadFixturesSocialSupportSubjects(),
    loadFixturesUsers(),
    ...loadFixturesBeneficiaries(),
    ...loadFixturesSocialSupports(),
    loadFixturesBeneficiaryRelatives(),
    loadFixturesBudgets(),
    loadFixturesBudgetIncomes(),
    loadFixturesBudgetExpenses()
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
