import { Prisma, PrismaClient } from '@prisma/client'

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prismaClient: PrismaClient | undefined
}

const client =
  global.prismaClient ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
  })

export const beneficiaryHook = Prisma.defineExtension({
  name: 'beneficiaryHook',
  query: {
    beneficiary: {
      $allOperations({ operation, args, query }) {
        if (
          operation === 'update' ||
          operation === 'updateMany' ||
          operation === 'updateManyAndReturn' ||
          operation === 'create' ||
          operation === 'createMany' ||
          operation === 'createManyAndReturn'
        ) {
          args.data = { ...args.data, lastActivity: new Date() }
        }

        if (operation === 'upsert') {
          args.create = { ...args.create, lastActivity: new Date() }
          args.update = { ...args.update, lastActivity: new Date() }
          return query(args)
        }

        return query(args)
      }
    },
    document: {
      async create({ args, query }) {
        const beneficiaryId = args.data.beneficiaryId
        if (!beneficiaryId) {
          throw new Error('beneficiaryId is required')
        }
        console.log('in create document hook')

        await client.beneficiary.update({
          where: { id: beneficiaryId },
          data: { lastActivity: new Date() }
        })

        return query(args)
      },
      async update({ args, query }) {
        // nope make it a query
        const beneficiary = args.data.beneficiaryId
        if (!beneficiary) {
          throw new Error('beneficiaryId is required')
        }

        const beneficiaryId =
          typeof beneficiary === 'string' ? beneficiary : beneficiary.set

        await client.beneficiary.update({
          where: { id: beneficiaryId },
          data: { lastActivity: new Date() }
        })

        return query(args)
      }
    }
  }
})

export const prismaClient = client.$extends(beneficiaryHook)

export * from '@prisma/client'

if (process.env.NODE_ENV !== 'production') {
  global.prismaClient = client
}
