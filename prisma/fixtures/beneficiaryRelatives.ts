import { Prisma } from '@prisma/client'
import { fixturesBeneficiaries } from './'

export const fixturesBeneficiaryRelatives = [
  {
    id: '076d6d60-6665-484a-8ea2-b9a2e5da8d37',
    beneficiaryId: fixturesBeneficiaries[0].id
  },
  {
    id: '298377e7-96d7-4fa8-b90c-5e04e16e73a2',
    beneficiaryId: fixturesBeneficiaries[1].id
  },
  {
    id: '0ad964d6-8859-4a1e-a9ac-51abd78c3463',
    beneficiaryId: fixturesBeneficiaries[10].id
  },
  {
    id: '92f09911-aa27-46fe-9def-ac4231e47897',
    beneficiaryId: fixturesBeneficiaries[10].id
  }
] satisfies Prisma.BeneficiaryRelativeUncheckedCreateInput[]
