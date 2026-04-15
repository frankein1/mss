import { z } from 'zod/v4'

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
export * from './partnerOrganization'
export * from './socialSupportSubject.schema'
export * from './filter.schema'
export * from './relative.schema'
export * from './notification.schema'
export * from './document.schema'
export * from './comment.schema'
export * from './budget.schema'
export * from './dataInclusion.schema'
export * from './job.schema'
export * from './rdvsp.schema'
export * from './workshop'
export * from './minister'
export * from './redirection'

z.config({
  customError(issue) {
    if (issue.code === 'invalid_value') {
      return 'Veuillez sélectionner une option proposée.'
    }
  }
})
