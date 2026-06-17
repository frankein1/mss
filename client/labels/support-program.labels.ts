import type { SupportProgram } from '@prisma/client'
import type { FieldLabels } from '~/types/fieldLabels'

type SupportProgramFieldLabels = Pick<
  SupportProgram,
  'precisions' | 'startDate' | 'endDate' | 'exitReason'
> & {
  name: string
  partnerOrganisationId: string
}

export const supportProgramFieldLabels: FieldLabels<SupportProgramFieldLabels> =
  {
    name: 'Nom du dispositif',
    startDate: "Date d'entrée",
    endDate: 'Date de sortie',
    exitReason: 'Motif de sortie',
    partnerOrganisationId: 'Organisme partenaire',
    precisions: 'Précisions'
  }

export const supportProgramExportFieldLabels = {
  supportProgramName: supportProgramFieldLabels.name,
  supportProgramStartDate: supportProgramFieldLabels.startDate,
  supportProgramEndDate: supportProgramFieldLabels.endDate,
  supportProgramExitReason: supportProgramFieldLabels.exitReason,
  supportProgramPartnerOrganisationName:
    supportProgramFieldLabels.partnerOrganisationId,
  supportProgramPrecisions: supportProgramFieldLabels.precisions
}
