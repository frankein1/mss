import { BeneficiaryStatus, PrismaClient } from '@prisma/client'
import { fakerFR as faker } from '@faker-js/faker'

const prismaClient = new PrismaClient()
const STRUCTURE_COUNT = 100
const FAMILY_FILE_PER_STRUCTURE_COUNT = 1000

function randomStatus(): BeneficiaryStatus {
  const int = faker.number.int({ min: 0, max: 10 })
  if (int === 0) {
    return 'Archived'
  }
  if (int === 1) {
    return 'Deceased'
  }
  if (int === 2 || int === 3) {
    return 'Inactive'
  }
  return 'Active'
}

async function main() {
  for (let i = 0; i < STRUCTURE_COUNT; i++) {
    console.log('starting seed', i)
    const structure = await prismaClient.structure.create({
      data: {
        type: 'Ccas',
        name: faker.company.name(),
        zipcode: faker.location.zipCode(),
        city: faker.location.city(),
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
        email: faker.internet.email()
      }
    })

    if (i === 0) {
      console.log('Linking Jeanne Responsable to a structure...')
      await prismaClient.user.update({
        data: { structureId: structure.id },
        where: { id: '7e5c1734-35cb-4047-9035-a944961a67a4' }
      })
    }

    const families = await prismaClient.familyFile.createManyAndReturn({
      data: new Array(FAMILY_FILE_PER_STRUCTURE_COUNT).fill(null).map(() => ({
        structureId: structure.id
      }))
    })

    await prismaClient.beneficiary.createMany({
      data: families.map(({ id }) => ({
        firstName: faker.person.firstName(),
        birthName: faker.person.lastName(),
        usualName: faker.person.lastName(),
        birthDate: faker.date.birthdate(),
        structureId: structure.id,
        fileNumber: faker.string.ulid(),
        status: randomStatus(),
        familyFileId: id,
        zipcode: faker.location.zipCode(),
        city: faker.location.city(),
        street: faker.location.streetAddress(),
        phone1: faker.phone.number(),
        email: faker.internet.email()
      }))
    })
  }
}

main()
