import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { SecurityRuleContext } from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateBeneficiaryDevicesInput } from '~/server/schema'
import { updateBeneficiaryDevicesSchema } from '~/server/schema'
import { BeneficiaryService } from '~/server/services'
import { prismaClient } from '~/server/prisma'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateBeneficiaryDevicesInput
) => {
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.id
  )
  return permissions.edit.externalOrganisations
}

const handler = async ({
  ctx,
  input
}: {
  input: UpdateBeneficiaryDevicesInput
  ctx: ProtectedAppContext
}) => {
  const { id: beneficiaryId, devices } = input
  const structureId = ctx.structure.id

  await prismaClient.$transaction([
    prismaClient.beneficiaryDevice.deleteMany({ where: { beneficiaryId } }),
    ...devices.map(device =>
      prismaClient.beneficiaryDevice.create({
        data: {
          id: device.id,
          beneficiary: { connect: { id: beneficiaryId } },
          startDate: device.startDate ?? null,
          endDate: device.endDate ?? null,
          partnerOrganisationName: device.partnerOrganisationName ?? null,
          precisions: device.precisions ?? null,
          deviceName: {
            connectOrCreate: {
              where: { structureId_name: { structureId, name: device.name } },
              create: {
                name: device.name,
                structureId,
                createdById: ctx.user.id
              }
            }
          }
        }
      })
    )
  ])

  return { id: beneficiaryId }
}

export const updateDevicesMutation = createMutation({
  inputValidation: updateBeneficiaryDevicesSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.updateDevices',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
