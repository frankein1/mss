import { NotificationType } from '@prisma/client'
import { labelsToOptions } from '~/utils/options'

export const notificationTypeLabels: { [key in NotificationType]: string } = {
  [NotificationType.DueDateToday]: "Échéance - Aujourd'hui",
  [NotificationType.DueDateOneMonth]: 'Échéance - Dans un mois',
  [NotificationType.EndOfSupport]: 'Fin de prise en charge',
  [NotificationType.NewComment]: 'Nouveau commentaire',
  [NotificationType.NewDocument]: 'Nouveau document'
}

export const notificationTypeOptions = labelsToOptions(notificationTypeLabels)
