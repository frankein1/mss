import type { Prisma } from '@prisma/client'
import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  getFamilyFilePermissions,
  validateBelongsToStructure,
  type SecurityRuleContext
} from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateBeneficiaryGeneralInformationInput } from '~/server/schema'
import { updateBeneficiaryGeneralInformationSchema } from '~/server/schema'
import { prepareRelationConnections } from '~/utils/prisma'
import { BeneficiaryRepo, NotificationRepo, UserRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'
import { prismaClient } from '~/server/prisma/prismaClient'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateBeneficiaryGeneralInformationInput
) => {
  const beneficiary = await BeneficiaryService.getBeneficiarySecurityTarget(
    ctx.user,
    input.id
  )
  const permissions = getFamilyFilePermissions({
    ctx,
    familyFile: beneficiary.familyFile
  })

  const referentsInDb = new Set(beneficiary.familyFile.referents.map(r => r.id))
  const newReferents = new Set(input.referents)
  const referentsAreUnchanged =
    newReferents.size === referentsInDb.size &&
    newReferents.isSubsetOf(referentsInDb)

  if (!permissions.changeReferent && !referentsAreUnchanged) {
    return false
  }

  if (!referentsAreUnchanged) {
    const allInStructure = await validateBelongsToStructure(
      ctx.user,
      input.referents,
      UserRepo.count
    )
    if (!allInStructure) {
      return false
    }
  }

  return permissions.edit.general
}

function cleanInput(input: UpdateBeneficiaryGeneralInformationInput) {
  const { structureId: _structureId, referents: _referents, ...data } = input
  if (data.noPhone) {
    data.phone1 = null
    data.phone2 = null
  }

  return data
}

const handler = async ({
  input,
  ctx
}: {
  input: UpdateBeneficiaryGeneralInformationInput
  ctx: ProtectedAppContext
}) => {
  const { id, referents } = input
  const target = await BeneficiaryService.getBeneficiarySecurityTarget(
    ctx.user,
    input.id
  )

  const cleaned = cleanInput(input)

  const {
    familyFile: { referents: previousReferents }
  } = target
  const previousReferentIds = previousReferents.map(({ id }) => id)
  const referentConnections = prepareRelationConnections(
    referents,
    previousReferentIds
  )

  const updateBeneficiary = () => {
    return BeneficiaryRepo.update(ctx.user, {
      select: { id: true },
      where: { id },
      data: {
        ...cleaned,
        familyFile: {
          update: {
            data: {
              referents: referentConnections
            }
          }
        }
      }
    })
  }

  const transactions: (() => Prisma.PrismaPromise<any>)[] = [updateBeneficiary]

  // Delete removed referents notifications
  if (!sameIds(referents, previousReferentIds)) {
    const removedReferentsIds = referentConnections.disconnect.map(r => r.id)
    transactions.push(() =>
      NotificationRepo.prisma.deleteMany({
        where: {
          beneficiaryId: input.id,
          type: {
            in: ['DueDateOneMonth', 'DueDateToday']
          },
          recipientId: { in: removedReferentsIds }
        }
      })
    )
  }

  const [updatedBeneficiary, _deletedNotification] =
    await prismaClient.$transaction(transactions.map(t => t()))

  return updatedBeneficiary
}

export const updateGeneralInformationMutation = createMutation({
  inputValidation: updateBeneficiaryGeneralInformationSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.updateGeneralInformation',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})

const sameIds = (a: string[], b: string[]) => {
  if (a.length !== b.length) {
    return false
  }
  const setA = new Set(a)
  const setB = new Set(b)
  if (setA.size !== setB.size) {
    return false
  }
  return [...setA].every(id => setB.has(id))
}
