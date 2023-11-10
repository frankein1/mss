import type { GetBeneficiariesOutput } from '~/server/route'

export type Beneficiaries = GetBeneficiariesOutput['beneficiaries']
export type BeneficiaryItem = Beneficiaries[0]
