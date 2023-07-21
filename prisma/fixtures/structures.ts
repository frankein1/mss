import { Prisma } from '@prisma/client'

export const fixtureStructure = {
  id: '8adcd106-c652-4e4c-80df-beb373fae252',
  name: 'CCAS de Test',
  email: ' ccas-test@example.com',
  type: 'Ccas',
  address: '1 rue du Ruisseau',
  city: 'Ennui-sur-Blasé',
  zipcode: '00000',
  phone: '00 00 00 00 00'
} satisfies Prisma.StructureCreateManyInput
