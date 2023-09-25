import type { GetBeneficiariesOutput } from '~/server/trpc/routers'

export type Beneficiaries = GetBeneficiariesOutput['beneficiaries']
export type BeneficiaryItem = Beneficiaries[0]
