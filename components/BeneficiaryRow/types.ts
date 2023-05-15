import type { GetBeneficiariesOutput } from '~/server/routers'

export type BeneficiaryItem = GetBeneficiariesOutput['beneficiaries'][0]
