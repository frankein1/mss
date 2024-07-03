import { Prisma } from '@prisma/client'
import { fixtureStructures } from '.'

export const fixturesSocialSupportSubjects = [
  {
    id: '30790553-9df4-478b-a6a0-bef6945bfbaf',
    name: 'Inclusion numérique',
    default: 'InclusionNumerique',
    ownedByStructureId: fixtureStructures[0].id,
    used: true
  },
  {
    id: '6a493607-7a32-43d1-a529-5b15ba34839f',
    name: 'Domiciliation',
    default: 'Domiciliation',
    ownedByStructureId: fixtureStructures[0].id,
    used: true
  },
  {
    id: '1975ce96-dc1e-4af1-a3e7-119652569908',
    name: 'Aide sociale',
    default: 'AideSociale',
    ownedByStructureId: fixtureStructures[0].id,
    used: true
  },
  {
    id: 'afb7eded-3693-4dd9-97a5-d7c57d8118d4',
    name: 'Aides financières non remboursables',
    ownedByStructureId: fixtureStructures[0].id,
    used: true
  },
  {
    id: '3d9c5e6d-4b10-4358-8bad-3eb1b1922c51',
    name: 'Aides financières remboursables',
    ownedByStructureId: fixtureStructures[0].id,
    used: true
  },
  {
    id: 'a097282c-cf97-48f6-9932-832bb5b913b4',
    name: 'Aide alimentaire',
    default: 'AideAlimentaire',
    ownedByStructureId: fixtureStructures[0].id
  },
  {
    id: '1679c0c9-6ad7-44e8-9f1e-6e42e8a6f830',
    name: 'Revenu de solidarité active',
    default: 'RevenuDeSolidariteActive',
    ownedByStructureId: fixtureStructures[0].id
  },
  {
    id: '143d99a5-423d-4095-a567-9b28e4eb00ba',
    name: 'Autre',
    ownedByStructureId: fixtureStructures[0].id
  },
  {
    id: '66e6dac6-38eb-434e-9663-9934ff16adcb',
    name: "Aide médicale d'État",
    default: 'AideMedicaleDEtat',
    ownedByStructureId: fixtureStructures[0].id
  },
  {
    id: '6079a3c0-7da1-48dd-a9c0-889d8b22cc55',
    name: "Secours d'urgence",
    ownedByStructureId: fixtureStructures[0].id
  },
  {
    id: '2445b4bc-17a5-4005-8e7a-68af06479306',
    name: 'PASS Adulte',
    ownedByStructureId: fixtureStructures[0].id
  },
  {
    id: '5641909b-41d4-4e0d-bd41-9ec12f3fe49b',
    name: 'Aide à la culture',
    ownedByStructureId: fixtureStructures[0].id
  },
  {
    id: '8e6141ee-62fa-47c5-a503-fa6b33f0e8fe',
    name: 'Aide au relogement',
    ownedByStructureId: fixtureStructures[0].id
  }
] satisfies Prisma.SocialSupportSubjectCreateManyInput[]
