import { shield, allow, deny } from 'trpc-shield'
import { AppContext } from '~/server/trpc'

export const draftPermissions = shield<AppContext>(
  {
    query: {
      get: allow
    },
    mutation: {
      delete: allow
    }
  },
  { fallbackRule: deny }
)
