import { Prisma, HelpRequestSubject } from '@prisma/client'
import {
  fixtureStructure,
  fixturesBeneficiaries,
  fixturesFollowupTypes
} from './'

export const fixturesHelpRequests = [
  {
    id: 'c95126c4-b0b5-4606-82ca-8d95c544fd35',
    externalStructure: false,
    // openingDate: new Date('2022-10-26'),
    subject: HelpRequestSubject.Other,
    socialSupport: {
      create: {
        createdById: '9840ff03-0fef-4967-b533-66d81c25b44a',
        status: 'Accepted',
        structureId: fixtureStructure.id,
        beneficiaryId: fixturesBeneficiaries[0].id,
        types: { connect: { id: fixturesFollowupTypes[4].id } }
      }
    }
  },
  {
    id: '4aad5e90-7a9e-4aeb-90f1-1c986664f47f',

    externalStructure: false,
    // openingDate: new Date('2022-10-27'),
    subject: HelpRequestSubject.Other,
    socialSupport: {
      create: {
        createdById: '9840ff03-0fef-4967-b533-66d81c25b44a',
        status: 'InvestigationOngoing',
        structureId: fixtureStructure.id,
        beneficiaryId: fixturesBeneficiaries[2].id,
        types: { connect: { id: fixturesFollowupTypes[3].id } }
      }
    }
  }
] satisfies Prisma.HelpRequestCreateInput[]
