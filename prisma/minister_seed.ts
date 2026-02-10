import type { SocialSupportStatus, SocialSupportType } from '@prisma/client'
import { Minister, PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prismaClient = new PrismaClient()

const ID_LAURA_RESPONSABLE = '6665ad8a-26a9-405c-9cc2-2f369765c096'
const MINISTER_STRUCTURE_ID = '50421089-d230-431c-99ca-0beb177fb0e9'
const MARTIN_MARTINE_ID = '86f82368-7c08-403c-b0f2-d2d39d9ae6c3'

const socialSupportSubjects = [
  {
    name: 'Préparation à la retraite',
    ownedByStructureId: MINISTER_STRUCTURE_ID,
    used: true
  },
  {
    name: 'Pass culture',
    ownedByStructureId: MINISTER_STRUCTURE_ID,
    used: true
  },
  {
    name: 'Dossier CAF',
    ownedByStructureId: MINISTER_STRUCTURE_ID,
    used: true
  },
  {
    name: 'Remboursement de la cantine',
    ownedByStructureId: MINISTER_STRUCTURE_ID,
    used: true
  }
]

const main = async () => {
  console.log('⏱️ Loading fixtures...')
  // Ajouter des socialsupportsubject à la structure Ministere
  await prismaClient.socialSupportSubject.createMany({
    data: socialSupportSubjects
  })

  // Ajouter des accompagnements
  const randomSocialSupport = new Array(20).fill(null).map((item, index) => ({
    createdById: ID_LAURA_RESPONSABLE,
    lastUpdatedById: ID_LAURA_RESPONSABLE,
    beneficiaryId: MARTIN_MARTINE_ID,
    familyFileId: MARTIN_MARTINE_ID,
    ministre: randomMinister(),
    socialSupportType: 'Followup' as SocialSupportType,
    structureId: MINISTER_STRUCTURE_ID,
    status: 'InProgress' as SocialSupportStatus,
    subtype: 'PlannedInPerson',
    date: faker.date.between({ from: '2022-01-01', to: new Date() })
  }))

  const followupSupports = await prismaClient.socialSupport.createManyAndReturn(
    {
      data: randomSocialSupport,
      select: { id: true }
    }
  )
  await Promise.all([
    prismaClient.followup.createMany({
      data: followupSupports.map(({ id }) => ({
        socialSupportId: id,
        medium: 'PlannedInPerson'
      }))
    }),
    prismaClient.socialSupportSubject.update({
      where: {
        ownedByStructureId_name: {
          name: randomSubjectName() as string,
          ownedByStructureId: MINISTER_STRUCTURE_ID
        }
      },
      data: { socialSupports: { connect: followupSupports } }
    })
  ])

  console.log(`✅ Done! ${followupSupports.length} social supports created`)
}

main()
// 36   await prismaClient.socialSupportSubject.createMany(
// Foreign key constraint violated on the constraint: `followup_type_owned_by_structured_id_fkey`

const randomMinister = () => {
  const ministers = Object.values(Minister)
  // Return a random minister
  return ministers[Math.floor(Math.random() * ministers.length)]
}

const randomSubjectName = () => {
  const subjects = socialSupportSubjects
  return subjects[Math.floor(Math.random() * subjects.length)]?.name
}
