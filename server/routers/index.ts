import { beneficiaryRouter } from './beneficiaryRouter'
import { configRouter } from './configRouter'
import { followupRouter } from './followupRouter'
import { statRouter } from './statRouter'
import { userRouter } from './userRouter'
import { router } from '~/server/trpc'

export const appRouter = router({
  beneficiary: beneficiaryRouter,
  config: configRouter,
  followup: followupRouter,
  stat: statRouter,
  user: userRouter
})
// export type definition of API
export type AppRouter = typeof appRouter
