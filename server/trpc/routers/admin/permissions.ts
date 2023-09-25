import { allow } from 'trpc-shield'

export const adminPermissions = {
  query: {
    getStructures: allow,
    getStructure: allow,
    getUsers: allow,
    getUser: allow,
    getOverview: allow
  },
  mutation: {
    createStructure: allow,
    editStructure: allow,
    createUser: allow,
    editUser: allow
  }
}
