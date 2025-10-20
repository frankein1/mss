import type { RouterOutput } from '~/server/trpc/routers'

export type UsersOutput = RouterOutput['user']['getUsers']
