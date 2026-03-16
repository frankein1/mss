// TODO: delete me if unused
// import type { Prisma } from '@prisma/client'
// import { appendConstraints } from './helper/appendConstraints'
// import { prismaClient } from '~/server/prisma'
// import type { SecurityRuleGrantee } from '~/server/security'
// import { RedirectionConstraints } from '../constraints'

// function updateMany<T extends Prisma.RedirectionUpdateManyArgs>(
//   user: SecurityRuleGrantee,
//   params: Prisma.SelectSubset<T, Prisma.RedirectionUpdateManyArgs>
// ) {
//   appendConstraints(user, params, RedirectionConstraints.update)
//   return prismaClient.redirection.updateMany(params)
// }
// function update<T extends Prisma.RedirectionUpdateArgs>(
//   user: SecurityRuleGrantee,
//   params: Prisma.SelectSubset<T, Prisma.RedirectionUpdateArgs>
// ) {
//   appendConstraints(user, params, RedirectionConstraints.update)
//   return prismaClient.redirection.update(params)
// }

// export const RedirectionRepo = {
//   updateMany,
//   update,
//   prisma: {
//     updateMany: prismaClient.redirection.updateMany
//   }
// }
