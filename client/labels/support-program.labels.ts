import type { SupportProgram } from '@prisma/client'
import type { FieldLabels } from '~~/types/fieldLabels'

type SupportProgramFieldLabels = Pick<
  SupportProgram,
  'outcome' | 'startDate' | 'endDate'
> & {
  name: string
  exitReason: string
  partnerOrganisationIds: string
}

export const supportProgramFieldLabels: FieldLabels<SupportProgramFieldLabels> =
  {
    name: 'Nom du dispositif',
    startDate: "Date d'entrée",
    endDate: 'Date de sortie',
    exitReason: 'Motif de sortie',
    partnerOrganisationIds: 'Organismes partenaires',
    outcome: 'Atteinte des objectifs'
  }
