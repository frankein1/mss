import type { RouterOutput } from '~/server/trpc/routers'

export type AdminUserOutput = RouterOutput['admin']['getUser']
