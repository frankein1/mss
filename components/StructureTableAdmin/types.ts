import { RouterOutput } from '~/server/trpc/routers'

export type Structures = RouterOutput['admin']['getStructures']['structures']
