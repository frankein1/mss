import { RouterOutput } from '~/server/trpc/routers'

export type PartnerOrganizationData = RouterOutput['partner']['getOne']
