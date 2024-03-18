import { z } from 'zod'

export * from './beneficiary'
export * from './beneficiaryDraft'
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
export * from './partnerOrganization'
export * from './socialSupportSubject.schema'
export * from './filter.schema'
export * from './relative.schema'
export * from './notification.schema'
export * from './document.schema'
export * from './comment.schema'

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case 'invalid_date':
      return { message: 'Veuillez saisir une date valide : JJ/MM/AAAA.' }
    case 'invalid_enum_value':
      return { message: 'Veuillez sélectionner une option proposée.' }
    default:
      return { message: ctx.defaultError }
  }
}

z.setErrorMap(customErrorMap)
