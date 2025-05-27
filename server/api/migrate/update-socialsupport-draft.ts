import { defineEventHandler } from 'h3'
import { forbiddenError } from '~/server/trpc'
import { JwtUser } from '~/types/user'
import { prismaClient } from '~/server/prisma'

export default defineEventHandler(async event => {
  const { user }: { user: JwtUser } = event.context.auth
  if (!user || user.role !== 'Administrator') {
    throw forbiddenError()
  }

  const { exec } = await readBody(event)
  if (!exec) {
    throw forbiddenError()
  }

  const updated = await prismaClient.beneficiary.updateMany({
    where: {
      draft: true,
      socialSupports: {
        some: {}
      }
    },
    data: {
      draft: false
    }
  })

  return {
    updatedCount: updated.count
  }
})
