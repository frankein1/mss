import { Prisma } from '@prisma/client'
import {
  fixtureStructure,
  fixturesBeneficiaries,
  fixturesFollowupTypes
} from './'

export const fixturesFollowups = [
  {
    id: 'e20b26f8-52fd-4620-8959-4cbb4623fb05',
    status: 'Done',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[0].id,
    medium: 'PlannedInPerson',
    types: {
      connect: [
        { id: fixturesFollowupTypes[0].id },
        { id: fixturesFollowupTypes[1].id }
      ]
    },
    date: new Date('2022-10-20')
  },
  {
    id: '8f8a083f-f04f-4977-9e07-8b88135c7210',
    status: 'Done',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[0].id,
    medium: 'PhoneCall',
    types: {
      connect: [{ id: fixturesFollowupTypes[0].id }]
    },
    date: new Date('2022-10-21')
  },
  {
    id: '07e809c3-4b6e-4152-bde3-357c501c981f',
    status: 'Done',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[2].id,
    medium: 'Videoconference',

    types: {
      connect: [
        { id: fixturesFollowupTypes[2].id },
        { id: fixturesFollowupTypes[1].id }
      ]
    },
    date: new Date('2022-10-22')
  },
  {
    id: 'b811a9d7-ada7-42ca-b809-926caaebaf52',
    status: 'Done',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[1].id,
    medium: 'UnplannedInPerson',

    types: {
      connect: [{ id: fixturesFollowupTypes[2].id }]
    },
    date: new Date('2022-10-23')
  },
  {
    id: 'b15eba7c-d00d-4de6-a227-75361066c322',
    status: 'InProgress',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[2].id,
    medium: 'PlannedInPerson',

    types: {
      connect: [
        { id: fixturesFollowupTypes[3].id },
        { id: fixturesFollowupTypes[4].id }
      ]
    },
    date: new Date('2022-10-24')
  },
  {
    id: '19ed2ebb-4e28-433a-9e2d-d97d9098624a',
    status: 'InProgress',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[3].id,
    medium: 'PhoneCall',

    types: {
      connect: [{ id: fixturesFollowupTypes[4].id }]
    },
    date: new Date('2022-10-25')
  }
] satisfies Prisma.FollowupUncheckedCreateInput[]
