import { buildKeys } from '~/utils/keys/keyBuilder'
import { ArchiveReason } from '~/prisma/generated/client'

export const archiveReasonKeys = buildKeys({
  [ArchiveReason.NoActivity]:
    'Sans activité sur le dossier depuis plus de 2 ans',
  [ArchiveReason.EndOfFollowup]: 'Fin de l’accompagnement',
  [ArchiveReason.Reorientation]: 'Réorientation',
  [ArchiveReason.Death]: 'Décès',
  [ArchiveReason.Displacement]: 'Déménagement',
  [ArchiveReason.Transfer]: 'Entrée en établissement',
  [ArchiveReason.NotPresent]: 'La personne ne s’est pas présentée',
  [ArchiveReason.Other]: 'Autre'
})
