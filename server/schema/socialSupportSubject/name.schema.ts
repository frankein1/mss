import { limitedStringConstraint } from '../helpers.schema'

export const socialSupportSubjectNameConstraint = limitedStringConstraint(
  2,
  100
)
