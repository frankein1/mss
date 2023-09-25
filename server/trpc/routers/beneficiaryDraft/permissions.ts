import { shield, allow, deny } from 'trpc-shield'
import { AppContext } from '~/server/trpc'

export const beneficiaryDraftPermissions = shield<AppContext>(
  {
    mutation: {
      create: allow,
      update: allow
    }
  },
  { fallbackRule: deny }
)
