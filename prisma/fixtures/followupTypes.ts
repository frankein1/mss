import { Prisma } from '@prisma/client'
import { fixtureStructure } from './'

export const fixturesFollowupTypes = [
  {
    id: '30790553-9df4-478b-a6a0-bef6945bfbaf',
    name: 'Inclusion numérique',
    legallyRequired: false,
    default: 'InclusionNumerique',
    ownedByStructureId: fixtureStructure.id
  },
  {
    id: '6a493607-7a32-43d1-a529-5b15ba34839f',
    name: 'Domiciliation',
    legallyRequired: true,
    default: 'Domiciliation',
    ownedByStructureId: fixtureStructure.id
  },
  {
    id: '1975ce96-dc1e-4af1-a3e7-119652569908',
    name: 'Aide sociale',
    legallyRequired: true,
    default: 'AideSociale',
    ownedByStructureId: fixtureStructure.id
  },
  {
    id: 'afb7eded-3693-4dd9-97a5-d7c57d8118d4',
    name: 'Aides financières non remboursables',
    legallyRequired: false,
    default: 'AidesFinancieresNonRemboursables',
    ownedByStructureId: fixtureStructure.id
  },
  {
    id: '3d9c5e6d-4b10-4358-8bad-3eb1b1922c51',
    name: 'Aides financières remboursables',
    legallyRequired: false,
    default: 'AidesFinancieresRemboursables',
    ownedByStructureId: fixtureStructure.id
  },
  {
    id: 'a097282c-cf97-48f6-9932-832bb5b913b4',
    name: 'Aide alimentaire',
    legallyRequired: false,
    default: 'AideAlimentaire',
    ownedByStructureId: fixtureStructure.id
  },
  {
    id: '1679c0c9-6ad7-44e8-9f1e-6e42e8a6f830',
    name: 'Revenu de solidarité active',
    legallyRequired: true,
    default: 'RevenuDeSolidariteActive',
    ownedByStructureId: fixtureStructure.id
  },
  {
    id: '143d99a5-423d-4095-a567-9b28e4eb00ba',
    name: 'Autre',
    legallyRequired: false,
    default: 'Other',
    ownedByStructureId: fixtureStructure.id
  },
  {
    id: '66e6dac6-38eb-434e-9663-9934ff16adcb',
    name: "Aide médicale d'État",
    legallyRequired: true,
    default: 'AideMedicaleDEtat',
    ownedByStructureId: fixtureStructure.id
  },
  {
    id: '6079a3c0-7da1-48dd-a9c0-889d8b22cc55',
    name: "Secours d'urgence",
    legallyRequired: false,
    ownedByStructureId: fixtureStructure.id
  },
  {
    id: '2445b4bc-17a5-4005-8e7a-68af06479306',
    name: 'PASS Adulte',
    legallyRequired: false,
    ownedByStructureId: fixtureStructure.id
  },
  {
    id: '5641909b-41d4-4e0d-bd41-9ec12f3fe49b',
    name: 'Aide à la culture',
    legallyRequired: false,
    ownedByStructureId: fixtureStructure.id
  },
  {
    id: '8e6141ee-62fa-47c5-a503-fa6b33f0e8fe',
    name: 'Aide au relogement',
    legallyRequired: false,
    ownedByStructureId: fixtureStructure.id
  }
] satisfies Prisma.FollowupTypeCreateManyInput[]
