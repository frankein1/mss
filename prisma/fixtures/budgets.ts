import { Prisma } from '@prisma/client'
import { fixturesBeneficiaries } from './'

export const fixturesBudgets = [
  {
    id: '660e0036-5a39-4fec-85a7-575d6e6be240',
    beneficiaryId: fixturesBeneficiaries[0].id
  },
  {
    id: '384d776f-6f77-4e9c-a868-adf6f3a923fe',
    beneficiaryId: fixturesBeneficiaries[1].id
  },
  {
    id: '6e6cd744-2566-4905-b4ac-bc8a008d81cc',
    beneficiaryId: fixturesBeneficiaries[2].id
  },
  {
    id: '8dd16d95-d907-4268-b6cf-7b20171ea564',
    beneficiaryId: fixturesBeneficiaries[3].id
  },
  {
    id: '6c3a973b-0917-4407-aed6-5e7ed23b73d9',
    beneficiaryId: fixturesBeneficiaries[4].id
  },
  {
    id: '8e622ca0-d254-4bb8-8c88-55c5d536cd50',
    beneficiaryId: fixturesBeneficiaries[5].id
  },
  {
    id: '7035a37a-c24d-42c2-be94-49fc2955f21b',
    beneficiaryId: fixturesBeneficiaries[6].id
  },
  {
    id: 'fb3d8d6c-72dc-4704-b2b7-90eb6c479d2f',
    beneficiaryId: fixturesBeneficiaries[7].id
  },
  {
    id: '9da3b440-a8d8-44a6-9cfd-3bfef472021c',
    beneficiaryId: fixturesBeneficiaries[8].id
  },
  {
    id: '3bfd6c8c-63b0-4370-b16d-506d833e9eed',
    beneficiaryId: fixturesBeneficiaries[9].id
  },
  {
    id: 'edb546c2-c9d1-4920-8bb8-1a87c7b98005',
    beneficiaryId: fixturesBeneficiaries[10].id
  }
] satisfies Prisma.BudgetUncheckedCreateInput[]
