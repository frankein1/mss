import { Prisma } from '@prisma/client'
import { fixtureStructure } from './'

export const fixturesFollowupTypes = [
  {
    name: 'Inclusion numérique',
    legallyRequired: false,
    default: 'InclusionNumerique',
    ownedByStructureId: fixtureStructure.id
  },
  {
    name: 'Domiciliation',
    legallyRequired: true,
    default: 'Domiciliation',
    ownedByStructureId: fixtureStructure.id
  },
  {
    name: 'Aide sociale',
    legallyRequired: true,
    default: 'AideSociale',
    ownedByStructureId: fixtureStructure.id
  },
  {
    name: 'Aides financières non remboursables',
    legallyRequired: false,
    default: 'AidesFinancieresNonRemboursables',
    ownedByStructureId: fixtureStructure.id
  },
  {
    name: 'Aides financières remboursables',
    legallyRequired: false,
    default: 'AidesFinancieresRemboursables',
    ownedByStructureId: fixtureStructure.id
  },
  {
    name: 'Aide alimentaire',
    legallyRequired: false,
    default: 'AideAlimentaire',
    ownedByStructureId: fixtureStructure.id
  },
  {
    name: 'Revenu de solidarité active',
    legallyRequired: true,
    default: 'RevenuDeSolidariteActive',
    ownedByStructureId: fixtureStructure.id
  },
  {
    name: 'Autre',
    legallyRequired: false,
    default: 'Other',
    ownedByStructureId: fixtureStructure.id
  },
  {
    name: "Aide médicale d'État",
    legallyRequired: true,
    default: 'AideMedicaleDEtat',
    ownedByStructureId: fixtureStructure.id
  },
  {
    name: "Secours d'urgence",
    legallyRequired: false,
    ownedByStructureId: fixtureStructure.id
  },
  {
    name: 'PASS Adulte',
    legallyRequired: false,
    ownedByStructureId: fixtureStructure.id
  },
  {
    name: 'Aide à la culture',
    legallyRequired: false,
    ownedByStructureId: fixtureStructure.id
  },
  {
    name: 'Aide au relogement',
    legallyRequired: false,
    ownedByStructureId: fixtureStructure.id
  }
] satisfies Prisma.FollowupTypeCreateManyInput[]
