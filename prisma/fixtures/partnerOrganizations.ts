import { Prisma } from '@prisma/client'
import { fixtureStructures } from './'

export enum FixturePartnerOrganization {
  CAF26 = 0,
  FranceTravail = 1,
  MairieValence = 2,
  MasinSolidarited = 3
}

export const fixturesPartnerOrganizations = [
  {
    id: '16f4c01f-738a-41b0-918c-73ae14e4267c',
    name: 'CAF 26',
    structureId: fixtureStructures[0].id
  },
  {
    id: '8a2d66f7-1d4b-4ac5-8238-7082d51b8281',
    name: 'France Travail',
    structureId: fixtureStructures[0].id
  },
  {
    id: 'f4105259-e47e-46b3-8a52-61b3ea273be4',
    name: 'Mairie de Valence',
    structureId: fixtureStructures[0].id
  },
  {
    id: 'c8825cc8-76fb-4792-8add-f66b62e8c839',
    name: 'Maison des Solidarités',
    structureId: fixtureStructures[0].id
  }
] as Prisma.PartnerOrganizationUncheckedCreateInput[]
