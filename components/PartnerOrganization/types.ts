import { RouterOutput } from '~/server/trpc/routers'

export type PartnerOrganizationData = RouterOutput['partner']['getOne']

export type DataInclusionStructure =
  RouterOutput['dataInclusion']['searchStructures'][0]
