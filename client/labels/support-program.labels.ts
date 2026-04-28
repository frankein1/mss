import type { SupportProgram } from '@prisma/client'
import type { FieldLabels } from '~~/types/fieldLabels'

type SupportProgramFieldLabels = Pick<
  SupportProgram,
  'outcome' | 'startDate' | 'endDate' | 'exitReason'
> & {
  name: string
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

export const supportProgramExportFieldLabels = {
  supportProgramName: supportProgramFieldLabels.name,
  supportProgramStartDate: supportProgramFieldLabels.startDate,
  supportProgramEndDate: supportProgramFieldLabels.endDate,
  supportProgramExitReason: supportProgramFieldLabels.exitReason,
  supportProgramPartnerOrganisationName:
    supportProgramFieldLabels.partnerOrganisationIds,
  supportProgramOutcome: supportProgramFieldLabels.outcome
}
