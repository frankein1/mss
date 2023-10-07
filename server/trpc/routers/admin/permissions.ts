import { rule } from 'trpc-shield'
import { AppContext } from '~/server/trpc'

const isAdmin = rule<AppContext>()(ctx => {
  const user = ctx.user
  return user ? user.role === 'Administrator' : false
})

export const adminPermissions = {
  query: {
    getStructures: isAdmin,
    getStructure: isAdmin,
    getUsers: isAdmin,
    getUser: isAdmin,
    getOverview: isAdmin
  },
  mutation: {
    createStructure: isAdmin,
    editStructure: isAdmin,
    createUser: isAdmin,
    editUser: isAdmin
  }
}
