import { FileInstructionType, Prisma } from '@prisma/client'
import {
  fixtureStructure,
  fixturesBeneficiaries,
  FixtureBeneficiary,
  fixturesSocialSupportSubjects,
  fixturesUsers,
  FixtureUserRole,
  fixturesPartnerOrganizations,
  FixturePartnerOrganization,
  fixturesPartnerOrganizationContacts
} from './'

const fixturesFollowupSocialSupports = [
  {
    id: 'e20b26f8-52fd-4620-8959-4cbb4623fb05',
    createdById: fixturesUsers[FixtureUserRole.Referent].id,
    status: 'Done',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.TEARLE].id,
    familyFileId: fixturesBeneficiaries[FixtureBeneficiary.TEARLE].id,
    subjects: {
      connect: [
        { id: fixturesSocialSupportSubjects[0].id },
        { id: fixturesSocialSupportSubjects[1].id }
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
    createdById: fixturesUsers[FixtureUserRole.Referent].id,
    status: 'Done',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.TEARLE].id,
    familyFileId: fixturesBeneficiaries[FixtureBeneficiary.TEARLE].id,
    subjects: {
      connect: [{ id: fixturesSocialSupportSubjects[0].id }]
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
    createdById: fixturesUsers[FixtureUserRole.Referent].id,
    status: 'Done',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id,
    familyFileId: fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id,
    subjects: {
      connect: [
        { id: fixturesSocialSupportSubjects[2].id },
        { id: fixturesSocialSupportSubjects[1].id }
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
    createdById: fixturesUsers[FixtureUserRole.Referent].id,
    status: 'Done',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.PENSON].id,
    familyFileId: fixturesBeneficiaries[FixtureBeneficiary.PENSON].id,
    subjects: {
      connect: [{ id: fixturesSocialSupportSubjects[2].id }]
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
    createdById: fixturesUsers[FixtureUserRole.Referent].id,
    status: 'InProgress',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id,
    familyFileId: fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id,
    subjects: {
      connect: [
        { id: fixturesSocialSupportSubjects[3].id },
        { id: fixturesSocialSupportSubjects[4].id }
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
    createdById: fixturesUsers[FixtureUserRole.Referent].id,
    status: 'InProgress',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.UNKNOWN].id,
    familyFileId: fixturesBeneficiaries[FixtureBeneficiary.UNKNOWN].id,
    subjects: {
      connect: [{ id: fixturesSocialSupportSubjects[4].id }]
    },
    date: new Date('2022-10-25'),
    comments: {
      create: {
        id: '24d14db7-c0ac-4924-86ae-c786efba3afc',
        createdById: fixturesUsers[FixtureUserRole.StructureManager].id,
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisl erat, facilisis eget congue eget, fermentum vitae ante. Maecenas bibendum quis dui luctus molestie. Fusce sollicitudin dolor eget libero tempus semper. Praesent non urna libero. Vivamus vitae ex magna. Ut semper, sem vitae tincidunt finibus, nisl tortor blandit massa, vel rutrum est felis quis metus. In hac habitasse platea dictumst. Ut eget sapien sodales, varius lorem ut, posuere est. Quisque fermentum, erat a luctus vehicula, lorem quam cursus lorem, sed mollis augue felis et urna.',
        notification: {
          create: {
            id: '3a39f0ae-17c0-4616-9e76-523faad59cfc',
            recipientId: fixturesUsers[FixtureUserRole.Referent].id,
            familyFileId: fixturesBeneficiaries[3].id,
            socialSupportId: '19ed2ebb-4e28-433a-9e2d-d97d9098624a',
            type: 'NewComment',
            itemCreatedById: fixturesUsers[FixtureUserRole.StructureManager].id
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
        familyFileId: fixturesBeneficiaries[3].id,
        createdById: fixturesUsers[FixtureUserRole.StructureManager].id,
        notifications: {
          create: {
            id: '907300c8-105d-421a-9ee5-a0599f0822e6',
            recipientId: fixturesUsers[FixtureUserRole.Instructor].id,
            familyFileId: fixturesBeneficiaries[3].id,
            type: 'NewDocument',
            itemCreatedById: fixturesUsers[FixtureUserRole.StructureManager].id
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
    createdById: fixturesUsers[FixtureUserRole.SocialWorker].id,
    status: 'Accepted',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.TEARLE].id,
    familyFileId: fixturesBeneficiaries[FixtureBeneficiary.TEARLE].id,
    subjects: { connect: { id: fixturesSocialSupportSubjects[4].id } },
    socialSupportType: 'HelpRequest',
    date: new Date('2022-10-26'),
    fileInstruction: {
      create: {
        type: FileInstructionType.Other,
        externalStructure: false,
        helpRequest: {
          create: {
            financialSupport: false,
            subjectId: fixturesSocialSupportSubjects[4].id,
            prescribingOrganizationId:
              fixturesPartnerOrganizations[
                FixturePartnerOrganization.MairieValence
              ].id
          }
        }
      }
    }
  },
  {
    id: '4aad5e90-7a9e-4aeb-90f1-1c986664f47f',
    createdById: fixturesUsers[FixtureUserRole.SocialWorker].id,
    status: 'InvestigationOngoing',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id,
    familyFileId: fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id,
    subjects: { connect: { id: fixturesSocialSupportSubjects[3].id } },
    socialSupportType: 'HelpRequest',
    date: new Date('2022-10-27'),
    fileInstruction: {
      create: {
        type: FileInstructionType.Other,
        externalStructure: false,
        helpRequest: {
          create: {
            financialSupport: false,
            subjectId: fixturesSocialSupportSubjects[3].id
          }
        }
      }
    }
  },
  {
    id: 'da9acc1f-4927-4794-be6a-12f3b02b5478',
    createdById: fixturesUsers[FixtureUserRole.SocialWorker].id,
    status: 'Accepted',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.UNKNOWN].id,
    familyFileId: fixturesBeneficiaries[FixtureBeneficiary.UNKNOWN].id,
    subjects: { connect: { id: fixturesSocialSupportSubjects[4].id } },
    socialSupportType: 'HelpRequest',
    date: new Date('2022-10-18'),
    fileInstruction: {
      create: {
        type: FileInstructionType.Financial,
        externalStructure: false,
        helpRequest: {
          create: {
            financialSupport: true,
            subjectId: fixturesSocialSupportSubjects[4].id,
            askedAmount: 2000,
            allocatedAmount: 2000,
            prescribingOrganizationId:
              fixturesPartnerOrganizations[FixturePartnerOrganization.CAF26].id
          }
        }
      }
    }
  },
  {
    id: '047f05e4-2ce2-40c5-ab6e-b16fe7a55c24',
    createdById: fixturesUsers[FixtureUserRole.SocialWorker].id,
    status: 'Accepted',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.UNKNOWN].id,
    familyFileId: fixturesBeneficiaries[FixtureBeneficiary.UNKNOWN].id,
    subjects: { connect: { id: fixturesSocialSupportSubjects[4].id } },
    socialSupportType: 'HelpRequest',
    date: new Date('2022-11-03'),
    fileInstruction: {
      create: {
        type: FileInstructionType.Financial,
        externalStructure: true,
        instructorOrganizationId:
          fixturesPartnerOrganizationContacts[0].partnerId,
        instructorOrganizationContactId:
          fixturesPartnerOrganizationContacts[0].id,
        dispatchDate: new Date('2022-11-03'),
        helpRequest: {
          create: {
            financialSupport: true,
            subjectId: fixturesSocialSupportSubjects[4].id,
            askedAmount: 1000,
            allocatedAmount: 1000,
            isRefundable: true
          }
        }
      }
    }
  },
  {
    id: '8cc71beb-6c55-4ec4-85bd-80a93cd0e553',
    createdById: fixturesUsers[FixtureUserRole.SocialWorker].id,
    status: 'Accepted',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.UNKNOWN].id,
    familyFileId: fixturesBeneficiaries[FixtureBeneficiary.UNKNOWN].id,
    subjects: { connect: { id: fixturesSocialSupportSubjects[4].id } },
    socialSupportType: 'HelpRequest',
    date: new Date('2022-12-09'),
    fileInstruction: {
      create: {
        type: FileInstructionType.Financial,
        externalStructure: true,
        instructorOrganizationId:
          fixturesPartnerOrganizationContacts[0].partnerId,
        instructorOrganizationContactId:
          fixturesPartnerOrganizationContacts[0].id,
        dispatchDate: new Date('2022-12-21'),
        helpRequest: {
          create: {
            financialSupport: true,
            subjectId: fixturesSocialSupportSubjects[4].id,
            askedAmount: 5000,
            allocatedAmount: 5000,
            isRefundable: true,
            prescribingOrganizationId:
              fixturesPartnerOrganizations[
                FixturePartnerOrganization.MairieValence
              ].id
          }
        }
      }
    }
  },
  {
    id: '8f6da38f-82ff-4121-ae77-45fc707a1acc',
    createdById: fixturesUsers[FixtureUserRole.SocialWorker].id,
    status: 'InvestigationOngoing',
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.PENBERTHY].id,
    familyFileId: fixturesBeneficiaries[FixtureBeneficiary.PENBERTHY].id,
    subjects: { connect: { id: fixturesSocialSupportSubjects[3].id } },
    socialSupportType: 'HelpRequest',
    date: new Date('2023-10-19'),
    fileInstruction: {
      create: {
        type: FileInstructionType.Financial,
        externalStructure: true,
        dispatchDate: new Date('2022-10-19'),
        helpRequest: {
          create: {
            financialSupport: true,
            subjectId: fixturesSocialSupportSubjects[3].id,
            askedAmount: 1500
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
