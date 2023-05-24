import { NotificationType } from '@prisma/client'

export const notificationTypeLabels: { [key in NotificationType]: string } = {
  [NotificationType.DueDate]: 'Échéance',
  [NotificationType.EndOfSupport]: 'Fin de prise en charge',
  [NotificationType.NewComment]: 'Nouveau commentaire',
  [NotificationType.NewDocument]: 'Nouveau document'
}

export const notificationTypeOptions = labelsToOptions(notificationTypeLabels)
