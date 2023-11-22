import { RouterOutput } from '~/server/trpc/routers'

export type GetDocumentsOutput =
  RouterOutput['beneficiary']['getBeneficiaryDocuments']
export type GetDocuments = GetDocumentsOutput['documents']
export type GetDocument = GetDocumentsOutput['documents'][0]['document']
