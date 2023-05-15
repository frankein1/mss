import type { GetBeneficiariesOutput } from '~/server/routers'

export type Beneficiaries = GetBeneficiariesOutput['beneficiaries']
export type BeneficiaryItem = Beneficiaries[0]
