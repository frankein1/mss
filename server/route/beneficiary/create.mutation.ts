import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  CreateBeneficiaryInput,
  createBeneficiarySchema
} from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { generateFileNumber } from '~/utils/generateFileNumber'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { BeneficiaryRepo } from '~/server/repository'

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

  const beneficiary = await BeneficiaryRepo.create(user, {
    data: {
      structureId: structure.id,
      fileNumber,
      referents: {
        connect: referents.map(referent => ({ id: referent }))
      },
      createdById: user.id,
      ...data
    }
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.CREATE,
    object: 'Beneficiary',
    objectId: beneficiary.id
  })

  return { id: beneficiary.id }
}

export const createBeneficiaryMutation = createMutation({
  inputValidation: createBeneficiarySchema,
  securityCheck,
  handler
})
