import { rule } from 'trpc-shield'
import { AppContext } from '~/server/trpc'

export const isActive = rule<AppContext>()(ctx => {
  return ctx.user?.status === 'Active'
})
