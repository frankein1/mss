import { Prisma } from '@prisma/client'

export enum FixtureStructure {
  Test = 0,
  Autun = 1,
  Ministère = 2
}

export const fixtureStructures = [
  {
    id: '8adcd106-c652-4e4c-80df-beb373fae252',
    name: 'CCAS de Test',
    email: 'ccas-test@example.com',
    type: 'Ccas',
    address: '1 rue du Ruisseau',
    city: 'Ennui-sur-Blasé',
    zipcode: '00000',
    phone: '01 00 00 00 00'
  },
  {
    id: '312b0b1e-d4fe-43e6-b8ca-48012dad4335',
    name: 'CCAS Autun',
    email: 'ccas-test-autun@example.com',
    type: 'Ccas',
    address: '1 rue des érables',
    city: 'Autun',
    zipcode: '71400',
    phone: '01 02 02 02 02'
  },
  {
    id: '50421089-d230-431c-99ca-0beb177fb0e9',
    name: 'Structure Test Ministère',
    email: 'ministere-test@example.com',
    type: 'Ministere',
    address: '43 rue Test',
    city: 'Paris',
    zipcode: '75004',
    phone: '+33 1 22 33 44 56'
  }
] satisfies Prisma.StructureCreateManyInput[]
