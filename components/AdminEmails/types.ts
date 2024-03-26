import { RouterOutput } from '~/server/trpc/routers'

type AdminEmailsOutput = RouterOutput['admin']['getEmails']

export type Emails = AdminEmailsOutput['emails']
