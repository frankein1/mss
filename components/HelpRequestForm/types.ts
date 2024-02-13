import { RouterOutput } from '~/server/trpc/routers'

export type HelpRequestPageItem = RouterOutput['helpRequest']['getOne']
