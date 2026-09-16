import { z } from 'zod'
import {
  requiredErrorMessage,
  invalidTypeErrorMessage,
  validDate,
  validEmailMessage,
  validSelectionMessage,
  validUrlMessage,
  invalidValueMessage
} from '~/utils/zod'

export * from './beneficiary'
export * from './followup'
export * from './user'
export * from './structure'
export * from './socialSupportSubject'
export * from './auth'
export * from './helpRequest'
export * from './helpers.schema'
export * from './email'
export * from './housingHelpRequest'
export * from './fileInstruction'
export * from './familyFile'
export * from './supportProgram'
export * from './statisticsSharing'
export * from './partnerOrganization'
export * from './socialSupportSubject.schema'
export * from './filter.schema'
export * from './relative.schema'
export * from './notification.schema'
export * from './document.schema'
export * from './comment.schema'
export * from './budget.schema'
export * from './dataEducationSchool.schema'
export * from './dataInclusion.schema'
export * from './job.schema'
export * from './rdvsp.schema'
export * from './workshop'
export * from './minister'
export * from './redirection'

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case 'invalid_type':
      if (issue.received === 'undefined') {
        return { message: requiredErrorMessage }
      }
      return { message: invalidTypeErrorMessage }
    case 'invalid_date':
      return { message: validDate }
    case 'invalid_enum_value':
      return { message: validSelectionMessage }
    case 'invalid_string':
      if (typeof issue.validation === 'string') {
        switch (issue.validation) {
          case 'uuid':
            return { message: validSelectionMessage }
          case 'email':
            return { message: validEmailMessage }
          case 'url':
            return { message: validUrlMessage }
        }
      }
      return { message: invalidValueMessage }
    default:
      return { message: ctx.defaultError }
  }
}

z.setErrorMap(customErrorMap)
