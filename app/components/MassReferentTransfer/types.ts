import type { RouterOutput } from '~~/server/trpc/routers'

export type BeneficiaryListItems =
  RouterOutput['beneficiary']['getBeneficiaryList']['items']

export type BeneficiaryListItem = BeneficiaryListItems[0] & {
  familyFile?: {
    referents?: { id: string; firstName: string; lastName: string }[]
  }
}
