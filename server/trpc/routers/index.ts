import { TRPCClientError } from '@trpc/client'
import type { inferRouterOutputs } from '@trpc/server'
import { beneficiaryRouter } from './beneficiary/router'
import { configRouter } from './configRouter'
import { followupRouter } from './followup/router'
import { statRouter } from './stat'
import { permissionsRouter } from './permissions'
import { userRouter } from './userRouter'
import { structureRouter } from './structureRouter'
import { helpRequestRouter } from './helpRequest/router'
import { fileInstructionRouter } from './fileInstruction/router'
import { notificationRouter } from './notification/router'
import { adminRouter } from './admin/router'
import { documentRouter } from './documentRouter'
import { commentRouter } from './commentRouter'
import { usersActivityRouter } from './usersActivity/router'
import { socialSupportRouter } from './socialSupport/router'
import { housingHelpRequestRouter } from './housingHelpRequest/router'
import { partnerRouter } from './partnerRouter/router'
import { router } from '~/server/trpc'

export const appRouter = router({
  admin: adminRouter,
  beneficiary: beneficiaryRouter,
  notification: notificationRouter,
  config: configRouter,
  partner: partnerRouter,
  followup: followupRouter,
  stat: statRouter,
  structure: structureRouter,
  user: userRouter,
  helpRequest: helpRequestRouter,
  fileInstruction: fileInstructionRouter,
  documents: documentRouter,
  comment: commentRouter,
  usersActivity: usersActivityRouter,
  permissions: permissionsRouter,
  socialSupport: socialSupportRouter,
  housingHelpRequest: housingHelpRequestRouter
})
// export type definition of API
export type AppRouter = typeof appRouter

export type RouterOutput = inferRouterOutputs<AppRouter>
export type ErrorOutput = TRPCClientError<AppRouter>

export * from '~/server/trpc/routers/usersActivity'
export * from '~/server/trpc/routers/admin'
export * from '~/server/trpc/routers/housingHelpRequest'
export * from '~/server/trpc/routers/notification'
export * from '~/server/trpc/routers/beneficiary'
export * from '~/server/trpc/routers/followup'
export * from '~/server/trpc/routers/fileInstruction'
