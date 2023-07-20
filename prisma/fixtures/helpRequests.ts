import { Prisma } from '@prisma/client'
import {
  fixtureStructure,
  fixturesBeneficiaries,
  fixturesFollowupTypes
} from './'

export const fixturesHelpRequests = [
  {
    id: 'c95126c4-b0b5-4606-82ca-8d95c544fd35',
    status: 'Accepted',
    typeId: fixturesFollowupTypes[4].id,
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[0].id,
    externalStructure: false,
    financialSupport: false,
    openingDate: new Date('2022-10-26')
  },
  {
    id: '4aad5e90-7a9e-4aeb-90f1-1c986664f47f',
    status: 'InvestigationOngoing',
    typeId: fixturesFollowupTypes[3].id,
    structureId: fixtureStructure.id,
    beneficiaryId: fixturesBeneficiaries[2].id,
    externalStructure: false,
    financialSupport: false,
    openingDate: new Date('2022-10-27')
  }
] satisfies Prisma.HelpRequestCreateManyInput[]
