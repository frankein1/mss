/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'
const prismaClient = new PrismaClient()

function loadFixturesUsers() {
  console.log('👤 Users...')

  return prismaClient.user.createMany({
    data: [  {
    id: '94dea7ab-92e9-479a-9795-e4fdd4ef42ae',
    firstName: 'Jeanne',
    lastName: 'Admin',
    email: 'jeanne.admin@yopmail.com',
    role: 'Administrator',
    status: 'Active',
  }],
    skipDuplicates: true
  })
}



function loadFixtures() {
  return [
    loadFixturesUsers(),
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
