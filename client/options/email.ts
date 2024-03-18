import { EmailStatus } from '@prisma/client'
import { buildKeys } from '~/utils/keys/keyBuilder'

export const emailStatusKeys = buildKeys({
  [EmailStatus.Error]: 'Erreur',
  [EmailStatus.Sending]: "En cours d'envoi",
  [EmailStatus.Sent]: 'Envoyé',
  [EmailStatus.ToSend]: 'À envoyer'
})
