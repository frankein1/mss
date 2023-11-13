import type { inferRouterOutputs } from '@trpc/server'
import { AppRouter } from '~/server/trpc/routers'

type RouterOutput = inferRouterOutputs<AppRouter>

type GetBeneficiariesOutput = RouterOutput['beneficiary']['getBeneficiaries']

export type GetBeneficiaries = GetBeneficiariesOutput['beneficiaries']
export type BeneficiaryItem = GetBeneficiaries[0]
