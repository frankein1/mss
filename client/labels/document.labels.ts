import type { Document } from '@prisma/client'
import type { FieldLabels } from '~/types/fieldLabels'

type DocumentFieldLabels = Pick<
  Document,
  'type' | 'confidential' | 'tags' | 'name'
> & { file: string }

export const documentFieldLabels: FieldLabels<DocumentFieldLabels> = {
  type: 'Type de document',
  confidential: 'Confidentiel',
  tags: 'Thèmes',
  name: 'Nom du fichier',
  file: 'Fichier'
}
