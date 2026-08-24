import { SupportProgramOutcome } from '@prisma/client'
import { buildKeys } from '~/utils/keys/keyBuilder'

export const supportProgramOutcomeKeys = buildKeys({
  [SupportProgramOutcome.NotAchieved]: 'Non atteint',
  [SupportProgramOutcome.PartiallyAchieved]: 'Partiel',
  [SupportProgramOutcome.SubjectToConditions]: 'Sous réserve',
  [SupportProgramOutcome.Achieved]: 'Atteint',
  [SupportProgramOutcome.Exceeded]: 'Dépassé'
})
