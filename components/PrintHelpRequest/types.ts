import { RouterOutput } from '~/server/trpc/routers'

export type HelpRequestOutput =
  RouterOutput['helpRequest']['getOne']['helpRequest']

export type HousingHelpRequestOutput =
  RouterOutput['housingHelpRequest']['getOne']['housingHelpRequest']

export type BeneficiaryMinimalInfoOutput =
  RouterOutput['beneficiary']['getBeneficiaryMinimalInfo']
