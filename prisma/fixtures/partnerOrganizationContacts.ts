import { Prisma } from '@prisma/client'
import { fixturesPartnerOrganizations } from './'

export const fixturesPartnerOrganizationContacts = [
  {
    id: '537efc3f-4107-4ba2-93a3-33ae8230e1db',
    name: 'Sandrine de la CAF 26',
    partnerId: fixturesPartnerOrganizations[0].id
  },
  {
    id: 'a5882a7f-ee85-483a-ba22-d006bf46abfd',
    name: 'Frédéric de la CAF 26',
    partnerId: fixturesPartnerOrganizations[0].id
  },
  {
    id: 'c18159b5-1bab-422d-9cba-587599301a81',
    name: 'Martine de France Travail',
    partnerId: fixturesPartnerOrganizations[1].id
  },
  {
    id: '608aa1a3-4d53-4314-a6f9-50ce74e0bc5d',
    name: 'Elisa de la Mairie de Valence',
    partnerId: fixturesPartnerOrganizations[2].id
  }
] as Prisma.PartnerOrganizationContactUncheckedCreateInput[]
