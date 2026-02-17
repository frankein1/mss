import type { MinisterEntity } from '@prisma/client'
import type { FieldLabels } from '~/types/fieldLabels'

export const ministerFieldLabels: FieldLabels<
  Omit<MinisterEntity, 'oldMinister'>
> = {
  id: 'Identifiant',
  lastName: 'Nom',
  firstName: 'Prénom',
  function: 'Fonction',
  government: 'Gouvernement',
  status: 'Status (ancien ou nouveau)',
  created: 'Date de création',
  updated: 'Date de mise à jour'
}
