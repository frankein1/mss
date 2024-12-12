import { buildKeys } from '~/utils/keys/keyBuilder'

// ArchiveReasons must come from Prisma from '@prisma/client'
export const enum ArchiveReasons {
  NoActivity = 'NoActivity',
  EndOfFollowup = 'EndOfFollowup',
  Reorientation = 'Reorientation',
  Death = 'Death',
  Displacement = 'Displacement',
  Transfer = 'Transfer',
  NotPresent = 'NotPresent',
  Other = 'Other'
}
export const archiveReasonKeys = buildKeys({
  [ArchiveReasons.NoActivity]:
    'Sans activité sur le dossier depuis plus de 2 ans',
  [ArchiveReasons.EndOfFollowup]: 'Fin de l’accompagnement',
  [ArchiveReasons.Reorientation]: 'Réorientation',
  [ArchiveReasons.Death]: 'Décès',
  [ArchiveReasons.Displacement]: 'Déménagement',
  [ArchiveReasons.Transfer]: 'Entrée en établissement',
  [ArchiveReasons.NotPresent]: 'La personne ne s’est pas présentée',
  [ArchiveReasons.Other]: 'Autre'
})
