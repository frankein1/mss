import { TRPCClientError } from '@trpc/client'
import type { inferRouterOutputs } from '@trpc/server'
import { beneficiaryRouter } from './beneficiaryRouter'
import { configRouter } from './configRouter'
import { followupRouter } from './followupRouter'
import { statRouter } from './statRouter'
import { userRouter } from './userRouter'
import { structureRouter } from './structureRouter'
import { router } from '~/server/trpc'

export const appRouter = router({
  beneficiary: beneficiaryRouter,
  config: configRouter,
  followup: followupRouter,
  stat: statRouter,
  structure: structureRouter,
  user: userRouter
})
// export type definition of API
export type AppRouter = typeof appRouter

export type RouterOutput = inferRouterOutputs<AppRouter>
export type ErrorOutput = TRPCClientError<AppRouter>
