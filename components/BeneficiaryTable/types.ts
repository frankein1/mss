import { RouterOutput } from '~/server/trpc/routers'

type BeneficiaryPage = RouterOutput['beneficiary']['getPage']

export type BeneficiaryPageItems = BeneficiaryPage['items']
export type BeneficiaryPageItem = BeneficiaryPageItems[0]
