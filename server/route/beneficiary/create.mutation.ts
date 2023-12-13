import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  CreateBeneficiaryInput,
  createBeneficiarySchema
} from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { generateFileNumber } from '~/utils/generateFileNumber'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { BeneficiaryRepo } from '~/server/database'
import { prepareDateFields } from '~/utils/prisma'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx: { user, structure }
}: {
  input: CreateBeneficiaryInput
  ctx: ProtectedAppContext
}) => {
  const { referents, ...data } = input

  const fileNumber = generateFileNumber()

  const beneficiary = await BeneficiaryRepo.prisma.create({
    data: {
      structureId: structure.id,
      fileNumber,
      referents: {
        connect: referents.map(referent => ({ id: referent }))
      },
      createdById: user.id,
      ...prepareDateFields(data, ['birthDate'])
    }
  })

  return { id: beneficiary.id }
}

export const createBeneficiaryMutation = createMutation({
  inputValidation: createBeneficiarySchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.create',
    target: 'Beneficiary',
    targetId: ({ ctx }) => {
      return ctx.user.id
    },
    action: UserActivityType.CREATE
  }
})
