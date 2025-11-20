import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { GetUserInput } from '~/server/schema'
import { getUserSchema } from '~/server/schema'
import { UserRepo, WorkshopNameRepo, WorkshopRepo } from '~/server/database'
import {
  AllowSecurityCheck,
  type SecurityRuleGrantee
} from '~/server/security/rules/types'

const securityCheck = AllowSecurityCheck

const handler = async ({
  ctx: { user },
  input: { id }
}: {
  ctx: ProtectedAppContext
  input: GetUserInput
}) => {
  return await getUser(user, id)
}

export const getUser = async (user: SecurityRuleGrantee, id: string) => {
  const userResult = await UserRepo.prisma.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      status: true,
      aidantConnectAuthorisation: true,
      externalRdvspId: true,
      _count: {
        select: {
          referentFor: true,
          createdDocuments: true,
          createdSocialSupports: true,
          createdComments: true
        }
      }
    }
  })

  const workshopsCountResult = await workshopsCount(user, id)
  const workshopNamesCountResult = await workshopNamesCount(user, id)
  return {
    ...userResult,
    _count: {
      ...userResult?._count,
      workshops: workshopsCountResult,
      workshopNames: workshopNamesCountResult
    }
  }
}

const workshopsCount = async (user: SecurityRuleGrantee, id: string) => {
  return await WorkshopRepo.count(user, {
    where: {
      createdById: id
    }
  })
}
const workshopNamesCount = async (user: SecurityRuleGrantee, id: string) => {
  return await WorkshopNameRepo.count(user, {
    where: {
      createdById: id
    }
  })
}

export const getUserQuery = createQuery({
  inputValidation: getUserSchema,
  securityCheck,
  handler
})
