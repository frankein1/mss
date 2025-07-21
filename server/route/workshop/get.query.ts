import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  AllowSecurityCheck,
  SecurityRuleGrantee
} from '~/server/security/rules/types'
import { WorkshopRepo } from '~/server/database'
import { getWorkshopSchema } from '~/server/schema/workshop/getWorkshop.schema'
import { isReferent } from '~/server/security'

export const handler = async ({
  ctx: { user },
  input
}: {
  ctx: ProtectedAppContext
  input: { id: string; includeAttendees?: boolean }
}) => {
  if (input.includeAttendees) {
    return await getOneWithAttendees(user, input.id)
  }
  return await getOne(user, input.id)
}

export const getOne = async (user: SecurityRuleGrantee, id: string) => {
  return await WorkshopRepo.findUniqueOrThrow(user, {
    where: { id },
    include: {
      workshopName: true
    }
  })
}
export const getOneWithAttendees = async (
  user: SecurityRuleGrantee,
  id: string
) => {
  return await WorkshopRepo.findUniqueOrThrow(user, {
    where: { id },
    include: {
      workshopName: true,
      workshopAttendees: {
        include: {
          beneficiary: {
            select: {
              id: true,
              birthDate: true,
              birthName: true,
              firstName: true,
              usualName: true,
              title: true,
              status: true,
              street: true,
              city: true,
              zipcode: true,
              phone1: true,
              email: true
            }
          },
          workshopExternalAttendee: true
        },
        // TODO: add this to WorkshopConstraint
        ...(isReferent(user) && {
          where: {
            OR: [
              {
                type: { not: 'Beneficiary' }
              },
              {
                beneficiary: {
                  familyFile: { referents: { some: { id: user.id } } }
                }
              }
            ]
          }
        })
      }
    }
  })
}

export const getQuery = createQuery({
  handler,
  securityCheck: AllowSecurityCheck,
  inputValidation: getWorkshopSchema
})
