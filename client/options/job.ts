import { JobStatus } from '@prisma/client'
import { buildKeys } from '~/utils/keys/keyBuilder'

export const jobResultStatusKeys = buildKeys({
  [JobStatus.Created]: 'Créé',
  [JobStatus.Ongoing]: 'En cours',
  [JobStatus.Success]: 'Succès',
  [JobStatus.Failure]: 'Echec'
})
