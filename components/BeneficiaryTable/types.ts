import { RouterOutput } from '~/server/trpc/routers'

type GetBeneficiariesOutput = RouterOutput['beneficiary']['getBeneficiaries']

export type GetBeneficiaries = GetBeneficiariesOutput['beneficiaries']
export type BeneficiaryItem = GetBeneficiaries[0]
