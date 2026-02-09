import { AgeLimitCondition } from '~/prisma/generated/client'
import { buildKeys } from '~/utils/keys/keyBuilder'

export const ageConditionKeys = buildKeys({
  [AgeLimitCondition.GreaterThan]: 'Réservé aux plus de',
  [AgeLimitCondition.LowerThan]: 'Réservé aux moins de'
})
