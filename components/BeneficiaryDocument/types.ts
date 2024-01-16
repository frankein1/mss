import { RouterOutput } from '~/server/trpc/routers'

export type GetDocumentsOutput =
  RouterOutput['beneficiary']['getBeneficiaryDocuments']
export type GetDocuments = GetDocumentsOutput['documents']
export type GetDocumentItem = GetDocumentsOutput['documents'][0]
export type GetDocument = GetDocumentItem['document']
