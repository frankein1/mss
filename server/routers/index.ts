import { TRPCClientError } from '@trpc/client'
import type { inferRouterOutputs } from '@trpc/server'
import { beneficiaryRouter } from './beneficiaryRouter'
import { configRouter } from './configRouter'
import { followupRouter } from './followupRouter'
import { statRouter } from './statRouter'
import { userRouter } from './userRouter'
import { structureRouter } from './structureRouter'
import { helpRequestRouter } from './helpRequestRouter'
import { notificationRouter } from './notificationRouter'
import { adminRouter } from './admin/router'
import { documentRouter } from './documentRouter'
import { commentRouter } from './commentRouter'
import { usersActivityRouter } from './usersActivityRouter/usersActivityRouter'
import { authRouter } from './authRouter'
import { router } from '~/server/trpc'

export const appRouter = router({
  admin: adminRouter,
  auth: authRouter,
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
  usersActivity: usersActivityRouter
})
// export type definition of API
export type AppRouter = typeof appRouter

type RouterOutput = inferRouterOutputs<AppRouter>
export type ErrorOutput = TRPCClientError<AppRouter>

export type GetBeneficiariesOutput =
  RouterOutput['beneficiary']['getBeneficiaries']
export type GetBeneficiaryOutput =
  RouterOutput['beneficiary']['getBeneficiaryDetails']['beneficiary']
export type GetBeneficiaryHistoryOutput =
  RouterOutput['beneficiary']['getBeneficiaryHistory']

export type GetFollowupsOutput = RouterOutput['followup']['getFollowups']
export type GetFollowupDetailsOutput =
  RouterOutput['followup']['getFollowupDetails']

export type GetHelpRequestsOutput =
  RouterOutput['helpRequest']['getHelpRequests']
export type GetHelpRequestDetailsOutput =
  RouterOutput['helpRequest']['getHelpRequestDetails']

export type GetExaminationDatesConfigOutput =
  RouterOutput['config']['getExaminationDates']

export type GetBeneficiaryDocumentsOutput =
  RouterOutput['beneficiary']['getBeneficiaryDocuments']
export type GetBeneficiaryDocumentOutput = GetBeneficiaryDocumentsOutput[0]

export * from '~/server/routers/usersActivityRouter'
export * from '~/server/routers/admin'
