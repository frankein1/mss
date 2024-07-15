import type { Prisma } from '@prisma/client'
import { fixtureStructures, FixtureStructure } from './'

export enum FixtureUserRole {
  Instructor = 0,
  Referent = 1,
  ReceptionAgent = 2,
  SocialWorker = 3,
  StructureManager = 4,
  Administrator = 5,
  StructureManagerNew = 6,
  SocialWorkerNew = 7,
  StructureManagerMinistere = 8
}

export const fixturesUsers = [
  {
    id: '94dea7ab-92e9-479a-9795-e4fdd4ef42af',
    firstName: 'Jeanne',
    lastName: 'Instructeur',
    email: 'jeanne.instructeure@example.com',
    role: 'Instructor',
    status: 'Disabled',
    structureId: fixtureStructures[FixtureStructure.Test].id
  },
  {
    id: 'ddd586d1-d747-4a54-896d-3e7cf90ea91f',
    firstName: 'Jeanne',
    lastName: 'Référente',
    email: 'jeanne.referente@example.com',
    role: 'Referent',
    status: 'Active',
    structureId: fixtureStructures[FixtureStructure.Test].id
  },
  {
    id: '3bce443c-b4ab-459b-9e18-a691375a8e6a',
    firstName: 'Jean',
    lastName: 'Agent',
    email: 'jean.agent@example.com',
    role: 'ReceptionAgent',
    status: 'Active',
    structureId: fixtureStructures[FixtureStructure.Test].id
  },
  {
    id: '9840ff03-0fef-4967-b533-66d81c25b44a',
    firstName: 'Jean',
    lastName: 'Travailleur social',
    email: 'jean.travailleur-social@example.com',
    role: 'SocialWorker',
    status: 'Active',
    structureId: fixtureStructures[FixtureStructure.Test].id
  },
  {
    id: '7e5c1734-35cb-4047-9035-a944961a67a4',
    firstName: 'Jeanne',
    lastName: 'Responsable',
    email: 'jeanne.responsable@example.com',
    role: 'StructureManager',
    status: 'Active',
    structureId: fixtureStructures[FixtureStructure.Test].id
  },
  {
    id: '6c89f7a9-105e-438f-9b56-917fb394a511',
    firstName: 'Admin',
    lastName: 'MSS',
    email: 'admin@mss.gouv.fr',
    role: 'Administrator',
    status: 'Active'
  },
  {
    id: 'cdeba22a-3ce0-4340-b279-9a2d984da663',
    firstName: 'Anita',
    lastName: 'CI-MSS Nouvelle Responsable',
    email: 'anita.responsable@example.com',
    role: 'StructureManager',
    status: 'Active',
    structureId: fixtureStructures[FixtureStructure.Autun].id
  },
  {
    id: '9ae9301f-466f-4750-8217-136f4a001ee9',
    firstName: 'Mehdi',
    lastName: 'CI-MSS Nouveau Travailleur social',
    email: 'mehdi.travailleur-social@example.com',
    role: 'SocialWorker',
    status: 'Active',
    structureId: fixtureStructures[FixtureStructure.Autun].id
  },
  {
    id: '6665ad8a-26a9-405c-9cc2-2f369765c096',
    firstName: 'Laura',
    lastName: 'CI-MSS Responsable Ministère',
    email: 'laura.responsable@example.com',
    role: 'StructureManager',
    status: 'Active',
    structureId: fixtureStructures[FixtureStructure.Ministère].id
  }
] satisfies Prisma.UserCreateManyInput[]

const CGU_VERSION = '1.1'

export const fixturesCGUHistory = [
  {
    id: '0de485c9-35a2-4086-904f-d92876cafb57',
    userId: fixturesUsers[FixtureUserRole.Instructor].id,
    date: new Date('2023-01-01'),
    version: CGU_VERSION
  },
  {
    id: 'c57ddce1-960f-4fc2-a7cf-465e2ae5d859',
    userId: fixturesUsers[FixtureUserRole.Referent].id,
    date: new Date('2023-01-01'),
    version: CGU_VERSION
  },
  {
    id: '3710f8fe-8646-4514-9de3-7b3bf2879a28',
    userId: fixturesUsers[FixtureUserRole.ReceptionAgent].id,
    date: new Date('2023-01-01'),
    version: CGU_VERSION
  },
  {
    id: 'b22ae2b3-1afd-4d27-980d-d0f3757ad741',
    userId: fixturesUsers[FixtureUserRole.SocialWorker].id,
    date: new Date('2023-01-01'),
    version: CGU_VERSION
  },
  {
    id: '6ee1090a-bc76-421d-9546-24ef0f85098c',
    userId: fixturesUsers[FixtureUserRole.StructureManager].id,
    date: new Date('2023-01-01'),
    version: CGU_VERSION
  },
  {
    id: '7088e777-6f2b-49d8-81c0-99d9862492d3',
    userId: fixturesUsers[FixtureUserRole.Administrator].id,
    date: new Date('2023-01-01'),
    version: CGU_VERSION
  },
  {
    id: 'bb432162-a268-49a6-b8bd-f4d02be601a6',
    userId: fixturesUsers[FixtureUserRole.StructureManagerMinistere].id,
    date: new Date('2023-01-01'),
    version: CGU_VERSION
  }
]
