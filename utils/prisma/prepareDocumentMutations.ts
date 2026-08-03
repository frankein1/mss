import type { Document } from '@prisma/client'

export function prepareDocumentsMutations<T extends Pick<Document, 'key'>[]>(
  inputDocuments: string[],
  targetDocuments?: T
) {
  return {
    connect: inputDocuments.map(key => ({ key })),
    disconnect: targetDocuments
      ?.filter(({ key }) => !inputDocuments.includes(key))
      .map(({ key }) => ({ key }))
  }
}
