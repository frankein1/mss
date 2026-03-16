// TODO: delete if unused
// import type { Prisma } from '@prisma/client'
// import { TRPCError } from '@trpc/server'
// import type { SecurityRuleGrantee } from '~/server/security'
// import { isAdmin } from '~/server/security/rules/helpers'

// const create = (user: SecurityRuleGrantee) => {
//   const data: Partial<Prisma.SocialSupportRedirectionCreateInput> = {}
//   if (isAdmin(user)) {
//     throw new TRPCError({
//       code: 'NOT_IMPLEMENTED',
//       message: 'redirection-constraints: create not implemented for admin'
//     })
//   }

//   if (!user.structureId) {
//     throw new Error('redirection-constraints: missing structure id')
//   }

//   Object.assign<
//     Partial<Prisma.SocialSupportRedirectionCreateInput>,
//     Partial<Prisma.SocialSupportRedirectionCreateInput>
//   >(data, {})
//   return data
// }

// const update = (user: SecurityRuleGrantee) => {
//   const where: Prisma.SocialSupportRedirectionWhereInput = {}
//   if (isAdmin(user)) {
//     return where
//   }

//   Object.assign<
//     Prisma.SocialSupportRedirectionWhereInput,
//     Prisma.SocialSupportRedirectionWhereInput
//   >(where, {})
//   return where
// }

// export const SocialSupportRedirectionConstraints = {
//   create,
//   update
// }
