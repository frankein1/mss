import { defineEventHandler } from 'h3'
import { forbiddenError } from '~/server/trpc'
import { JwtUser } from '~/types/user'
import { prismaClient } from '~/server/prisma'

export default defineEventHandler(async event => {
  const { user }: { user: JwtUser } = event.context.auth
  if (!user || user.role !== 'Administrator') {
    throw forbiddenError()
  }

  const allDraftBeneficiaryCount = await prismaClient.beneficiary.count({
    where: {
      draft: true
    }
  })

  const withSocialSupportCount = await prismaClient.beneficiary.count({
    where: {
      draft: true,
      socialSupports: {
        some: {}
      }
    }
  })

  return {
    allCount: allDraftBeneficiaryCount,
    withSocialSupportCount: withSocialSupportCount
  }
})
