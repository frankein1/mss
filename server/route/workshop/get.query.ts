import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { WorkshopAttendeeRepo, WorkshopRepo } from '~/server/database'
import { getWorkshopSchema } from '~/server/schema/workshop/getWorkshop.schema'
import { isReferent } from '~/server/security'
import { formatWorkshopAttendees } from '~/server/services/workshop/helper'
import { WorkshopAttendeeListType } from '@prisma/client'

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

async function getAttendeeCount(user: SecurityRuleGrantee, workshopId: string) {
  const [mainAttendeeCount, waitingAttendeeCount] = await Promise.all([
    WorkshopAttendeeRepo.count(user, {
      where: { listType: WorkshopAttendeeListType.Main, workshopId }
    }),
    WorkshopAttendeeRepo.count(user, {
      where: { listType: WorkshopAttendeeListType.Waiting, workshopId }
    })
  ])

  return {
    mainAttendees: mainAttendeeCount,
    waitingAttendees: waitingAttendeeCount
  }
}

export const getOne = async (user: SecurityRuleGrantee, id: string) => {
  const [workshop, _count] = await Promise.all([
    WorkshopRepo.findUniqueOrThrow(user, {
      where: { id },
      include: {
        workshopName: true
      }
    }),
    getAttendeeCount(user, id)
  ])

  return { ...workshop, _count }
}
export const getOneWithAttendees = async (
  user: SecurityRuleGrantee,
  id: string
) => {
  const [{ workshopAttendees, ...rest }, _count] = await Promise.all([
    WorkshopRepo.findUniqueOrThrow(user, {
      where: { id },
      include: {
        workshopName: true,
        partnerOrganization: {
          select: { id: true, name: true }
        },
        workshopAttendees: {
          include: {
            beneficiary: {
              select: {
                birthDate: true,
                birthName: true,
                firstName: true,
                usualName: true,
                title: true,
                street: true,
                city: true,
                zipcode: true,
                phone1: true,
                email: true
              }
            },
            workshopExternalAttendee: {
              select: {
                firstName: true,
                lastName: true,
                gender: true,
                birthDate: true,
                email: true,
                city: true,
                phone: true
              }
            }
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
    }),
    getAttendeeCount(user, id)
  ])

  return {
    ...rest,
    _count,
    workshopAttendees: formatWorkshopAttendees(workshopAttendees)
  }
}

export const getQuery = createQuery({
  handler,
  securityCheck: AllowSecurityCheck,
  inputValidation: getWorkshopSchema
})
