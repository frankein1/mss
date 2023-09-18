import type { Prisma } from '@prisma/client'
import { fixtureStructure } from './'

export const fixturesUsers = [
  {
    id: '94dea7ab-92e9-479a-9795-e4fdd4ef42af',
    firstName: 'Jeanne',
    lastName: 'Instructeur',
    email: 'jeanne.instructeure@example.com',
    role: 'Instructor',
    status: 'Disabled',
    structureId: fixtureStructure.id
  },
  {
    id: 'ddd586d1-d747-4a54-896d-3e7cf90ea91f',
    firstName: 'Jeanne',
    lastName: 'Référente',
    email: 'jeanne.référente@example.com',
    role: 'Referent',
    status: 'Active',
    structureId: fixtureStructure.id
  },
  {
    id: '3bce443c-b4ab-459b-9e18-a691375a8e6a',
    firstName: 'Jean',
    lastName: 'Agent',
    email: 'jean.agent@example.com',
    role: 'ReceptionAgent',
    status: 'Active',
    structureId: fixtureStructure.id
  },
  {
    id: '9840ff03-0fef-4967-b533-66d81c25b44a',
    firstName: 'Jean',
    lastName: 'Travailleur social',
    email: 'jean.travailleur-social@example.com',
    role: 'SocialWorker',
    status: 'Active',
    structureId: fixtureStructure.id
  },
  {
    id: '7e5c1734-35cb-4047-9035-a944961a67a4',
    firstName: 'Jeanne',
    lastName: 'Responsable',
    email: 'jeanne.responsable@example.com',
    role: 'StructureManager',
    status: 'Active',
    structureId: fixtureStructure.id
  },
  {
    firstName: 'Admin',
    lastName: 'MSS',
    email: 'admin@mss.gouv.fr',
    role: 'Administrator',
    status: 'Active'
  }
] satisfies Prisma.UserCreateManyInput[]
