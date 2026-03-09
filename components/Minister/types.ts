import type { RouterOutput } from '~/server/trpc/routers'

export type MinistersOutput = RouterOutput['minister']['getMinisters']
export type MinisterOutput = RouterOutput['minister']['getMinisters'][0]
