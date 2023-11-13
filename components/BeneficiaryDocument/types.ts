import { inferRouterOutputs } from '@trpc/server'
import { AppRouter } from '~/server/trpc/routers'

type RouterOutput = inferRouterOutputs<AppRouter>

export type GetDocumentsOutput =
  RouterOutput['beneficiary']['getBeneficiaryDocuments']
export type GetDocuments = GetDocumentsOutput['documents']
export type GetDocument = GetDocumentsOutput['documents'][0]['document']
