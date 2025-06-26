import { AgeLimitCondition } from '@prisma/client'
import { buildKeys } from '~/utils/keys/keyBuilder'

export const ageConditionKeys = buildKeys({
  [AgeLimitCondition.GreaterThan]: 'Limité aux plus de ...',
  [AgeLimitCondition.LowerThan]: 'Limité aux moins de ...'
})
