import type { RouterOutput } from '~~/server/trpc/routers'

export type AdminMinistersOutput = RouterOutput['admin']['getMinisters'][0]
export type AdminMinisterOutput = RouterOutput['admin']['getMinister']
