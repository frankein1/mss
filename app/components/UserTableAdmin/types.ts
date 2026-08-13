import type { RouterOutput } from '~~/server/trpc/routers'

export type AdminUsersOutput = RouterOutput['admin']['getUsers']['users']
