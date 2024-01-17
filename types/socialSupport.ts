import { HelpRequestSubject } from '@prisma/client'

export const ExtendedHelpRequestSubject = {
  ...HelpRequestSubject,
  Housing: 'Housing' as const
}

export type ExtendedHelpRequestSubject = keyof typeof ExtendedHelpRequestSubject
