import { RouterOutput } from '~/server/trpc/routers'

export type BeneficiaryEdition =
  RouterOutput['beneficiary']['getBeneficiaryDetails']['beneficiary']
