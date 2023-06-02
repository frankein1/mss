import type { Document } from '@prisma/client'

export function prepareDocumentsMutations(
  inputDocuments: string[],
  targetDocuments?: Document[]
) {
  return {
    connect: inputDocuments.map(key => ({ key })),
    disconnect: targetDocuments
      ?.filter(({ key }) => !inputDocuments.includes(key))
      .map(({ key }) => ({ key }))
  }
}
