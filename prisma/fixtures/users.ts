import type { Prisma } from '@prisma/client'
import { fixtureStructure } from './'

export const fixturesUsers = [
  {
    firstName: 'Jeanne',
    lastName: 'Instructeur',
    email: 'jeanne.instructeure@example.com',
    role: 'Instructor',
    status: 'Disabled',
    structureId: fixtureStructure.id
  },
  {
    firstName: 'Jeanne',
    lastName: 'Référente',
    email: 'jeanne.référente@example.com',
    role: 'Referent',
    status: 'Active',
    structureId: fixtureStructure.id
  },
  {
    firstName: 'Jean',
    lastName: 'Agent',
    email: 'jean.agent@example.com',
    role: 'ReceptionAgent',
    status: 'Active',
    structureId: fixtureStructure.id
  },
  {
    firstName: 'Jean',
    lastName: 'Travailleur social',
    email: 'jean.travailleur-social@example.com',
    role: 'SocialWorker',
    status: 'Active',
    structureId: fixtureStructure.id
  },
  {
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
