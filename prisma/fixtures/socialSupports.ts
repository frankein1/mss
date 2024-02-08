import { Prisma } from '@prisma/client'
import {
  fixtureStructure,
  fixturesBeneficiaries,
  fixturesFollowupTypes,
  fixturesUsers
} from './'

const fixturesFollowupSocialSupports = [
  {
    id: 'e20b26f8-52fd-4620-8959-4cbb4623fb05',
    createdById: fixturesUsers[1].id,
    status: 'Done',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[0].id,
    types: {
      connect: [
        { id: fixturesFollowupTypes[0].id },
        { id: fixturesFollowupTypes[1].id }
      ]
    },
    date: new Date('2022-10-20'),
    socialSupportType: 'Followup',
    followup: {
      create: {
        medium: 'PlannedInPerson'
      }
    }
  },
  {
    id: '8f8a083f-f04f-4977-9e07-8b88135c7210',
    createdById: fixturesUsers[1].id,
    status: 'Done',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[0].id,
    types: {
      connect: [{ id: fixturesFollowupTypes[0].id }]
    },
    date: new Date('2022-10-21'),
    socialSupportType: 'Followup',
    followup: {
      create: {
        medium: 'PhoneCall'
      }
    }
  },
  {
    id: '07e809c3-4b6e-4152-bde3-357c501c981f',
    createdById: fixturesUsers[1].id,
    status: 'Done',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[2].id,
    types: {
      connect: [
        { id: fixturesFollowupTypes[2].id },
        { id: fixturesFollowupTypes[1].id }
      ]
    },
    date: new Date('2022-10-22'),
    socialSupportType: 'Followup',
    followup: {
      create: {
        medium: 'Videoconference'
      }
    }
  },
  {
    id: 'b811a9d7-ada7-42ca-b809-926caaebaf52',
    createdById: fixturesUsers[1].id,
    status: 'Done',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[1].id,
    types: {
      connect: [{ id: fixturesFollowupTypes[2].id }]
    },
    date: new Date('2022-10-23'),
    socialSupportType: 'Followup',
    followup: {
      create: {
        medium: 'UnplannedInPerson'
      }
    }
  },
  {
    id: 'b15eba7c-d00d-4de6-a227-75361066c322',
    createdById: fixturesUsers[1].id,
    status: 'InProgress',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[2].id,
    types: {
      connect: [
        { id: fixturesFollowupTypes[3].id },
        { id: fixturesFollowupTypes[4].id }
      ]
    },
    date: new Date('2022-10-24'),
    socialSupportType: 'Followup',
    followup: {
      create: {
        medium: 'PlannedInPerson'
      }
    }
  },
  {
    id: '19ed2ebb-4e28-433a-9e2d-d97d9098624a',
    createdById: fixturesUsers[1].id,
    status: 'InProgress',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[3].id,
    types: {
      connect: [{ id: fixturesFollowupTypes[4].id }]
    },
    date: new Date('2022-10-25'),
    comments: {
      create: {
        id: '24d14db7-c0ac-4924-86ae-c786efba3afc',
        createdById: fixturesUsers[4].id,
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisl erat, facilisis eget congue eget, fermentum vitae ante. Maecenas bibendum quis dui luctus molestie. Fusce sollicitudin dolor eget libero tempus semper. Praesent non urna libero. Vivamus vitae ex magna. Ut semper, sem vitae tincidunt finibus, nisl tortor blandit massa, vel rutrum est felis quis metus. In hac habitasse platea dictumst. Ut eget sapien sodales, varius lorem ut, posuere est. Quisque fermentum, erat a luctus vehicula, lorem quam cursus lorem, sed mollis augue felis et urna.',
        notification: {
          create: {
            id: '3a39f0ae-17c0-4616-9e76-523faad59cfc',
            recipientId: fixturesUsers[1].id,
            beneficiaryId: fixturesBeneficiaries[3].id,
            socialSupportId: '19ed2ebb-4e28-433a-9e2d-d97d9098624a',
            type: 'NewComment',
            itemCreatedById: fixturesUsers[4].id
          }
        }
      }
    },
    documents: {
      create: {
        key: '97042692-54df-42ce-b755-ac40aef20f88',
        mimeType: 'application/pdf',
        name: 'Agir-pour-lenvironnement-Rapport-nucleaire.pdf',
        filenameDisk: 'b3d7eb72-e957-4a18-a2ce-6ec75a2f19e8.pdf',
        filenameDownload: 'Agir-pour-lenvironnement-Rapport-nucleaire.pdf',
        type: 'Cerfa',
        size: 887560,
        tags: ['BudgetRessources'],
        confidential: false,
        beneficiaryId: fixturesBeneficiaries[3].id,
        createdById: fixturesUsers[4].id,
        notifications: {
          create: {
            id: '907300c8-105d-421a-9ee5-a0599f0822e6',
            recipientId: fixturesUsers[0].id,
            beneficiaryId: fixturesBeneficiaries[3].id,
            type: 'NewDocument',
            itemCreatedById: fixturesUsers[4].id
          }
        }
      }
    },
    socialSupportType: 'Followup',
    followup: {
      create: {
        medium: 'PhoneCall'
      }
    }
  }
] satisfies Prisma.SocialSupportUncheckedCreateInput[]

const fixturesHelpRequestSocialSupports = [
  {
    id: 'c95126c4-b0b5-4606-82ca-8d95c544fd35',
    createdById: fixturesUsers[3].id,
    status: 'Accepted',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[0].id,
    types: { connect: { id: fixturesFollowupTypes[4].id } },
    socialSupportType: 'HelpRequest',
    date: new Date('2022-10-26'),
    fileInstruction: {
      create: {
        externalStructure: false,
        helpRequest: {
          create: {
            financialSupport: false,
            typeId: fixturesFollowupTypes[4].id
          }
        }
      }
    }
  },
  {
    id: '4aad5e90-7a9e-4aeb-90f1-1c986664f47f',
    createdById: fixturesUsers[3].id,
    status: 'InvestigationOngoing',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[2].id,
    types: { connect: { id: fixturesFollowupTypes[3].id } },
    socialSupportType: 'HelpRequest',
    date: new Date('2022-10-27'),
    fileInstruction: {
      create: {
        externalStructure: false,
        helpRequest: {
          create: {
            financialSupport: false,
            typeId: fixturesFollowupTypes[3].id
          }
        }
      }
    }
  }
] satisfies Prisma.SocialSupportUncheckedCreateInput[]

export const fixturesSocialSupports = [
  ...fixturesFollowupSocialSupports,
  ...fixturesHelpRequestSocialSupports
]
