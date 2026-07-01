import { RepClassification, SchoolStatus, SchoolType } from '@prisma/client'

const schoolTypeLabels: Record<SchoolType, string> = {
  [SchoolType.Ecole]: 'École',
  [SchoolType.College]: 'Collège',
  [SchoolType.Lycee]: 'Lycée',
  [SchoolType.EREA]: 'EREA',
  [SchoolType.MedicoSocial]: 'Médico-social',
  [SchoolType.ServiceAdministratif]: 'Service administratif',
  [SchoolType.InformationOrientation]: 'Information et orientation',
  [SchoolType.Autre]: 'Autre'
}

const schoolStatusLabels: Record<SchoolStatus, string> = {
  [SchoolStatus.OUVERT]: 'Ouvert',
  [SchoolStatus.FERME]: 'Fermé',
  [SchoolStatus.AFERMER]: 'À fermer',
  [SchoolStatus.AOUVRIR]: 'À ouvrir'
}

const repClassificationLabels: Record<RepClassification, string> = {
  [RepClassification.Rep]: 'REP',
  [RepClassification.RepPlus]: 'REP+'
}

export { schoolTypeLabels, schoolStatusLabels, repClassificationLabels }
