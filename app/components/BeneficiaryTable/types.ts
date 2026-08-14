import type { RouterOutput } from '~~/server/trpc/routers'

type BeneficiaryList = RouterOutput['beneficiary']['getBeneficiaryList']

export type BeneficiaryListItems = BeneficiaryList['items']
export type BeneficiaryListItem = BeneficiaryListItems[0] & {
  familyFile?: {
    referents?: { id: string; firstName: string; lastName: string }[]
  }
}
