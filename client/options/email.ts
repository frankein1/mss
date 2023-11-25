import { EmailStatus } from '@prisma/client'

export const EmailStatusLabels: { [key in EmailStatus]: string } = {
  [EmailStatus.Error]: 'Erreur',
  [EmailStatus.Sending]: "En cours d'envoi",
  [EmailStatus.Sent]: 'Envoyé',
  [EmailStatus.ToSend]: 'À envoyer'
}

export const emailStatusOptions = labelsToOptions(EmailStatusLabels)
