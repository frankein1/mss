import { rule } from 'trpc-shield'
import { AppContext } from '~/server/trpc'

export const isAuthenticated = rule<AppContext>()(ctx => {
  return ctx.user !== null
})
