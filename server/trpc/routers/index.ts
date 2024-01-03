import { TRPCClientError } from '@trpc/client'
import type { inferRouterOutputs } from '@trpc/server'
import { beneficiaryRouter } from './beneficiary/router'
import { configRouter } from './configRouter'
import { followupRouter } from './followup/router'
import { statRouter } from './stat'
import { permissionsRouter } from './permissions'
import { userRouter } from './userRouter'
import { structureRouter } from './structureRouter'
import { helpRequestRouter } from './helpRequestRouter'
import { notificationRouter } from './notificationRouter'
import { adminRouter } from './admin/router'
import { documentRouter } from './documentRouter'
import { commentRouter } from './commentRouter'
import { usersActivityRouter } from './usersActivity/router'
import { beneficiaryDraftRouter } from './beneficiaryDraft/router'
import { router } from '~/server/trpc'

export const appRouter = router({
  admin: adminRouter,
  beneficiary: beneficiaryRouter,
  notification: notificationRouter,
  config: configRouter,
  followup: followupRouter,
  stat: statRouter,
  structure: structureRouter,
  user: userRouter,
  helpRequest: helpRequestRouter,
  documents: documentRouter,
  comment: commentRouter,
  usersActivity: usersActivityRouter,
  beneficiaryDraft: beneficiaryDraftRouter,
  permissions: permissionsRouter
})
// export type definition of API
export type AppRouter = typeof appRouter

export type RouterOutput = inferRouterOutputs<AppRouter>
export type ErrorOutput = TRPCClientError<AppRouter>

export type GetHelpRequestDetailsOutput =
  RouterOutput['helpRequest']['getHelpRequestDetails']

export type GetExaminationDatesConfigOutput =
  RouterOutput['config']['getExaminationDates']

export * from '~/server/trpc/routers/usersActivity'
export * from '~/server/trpc/routers/admin'
