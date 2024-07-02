import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { StructureRepo } from '~/server/database'

const handler = async ({
  ctx: {
    structure: { id },
    user
  }
}: {
  ctx: ProtectedAppContext
}) => {
  const structure = await StructureRepo.findUniqueOrThrow(user, {
    where: { id }
  })

  const dpoIsFilled =
    structure.dpoEmail && structure.dpoFirstName && structure.dpoLastName

  const structurehasBeenCreatedBeforeMay =
    structure.created &&
    structure.created.getTime() < new Date('2024-05-30').getTime()

  const isStructureManager = user.role === 'StructureManager'

  const shouldFillDPO =
    !dpoIsFilled && isStructureManager && structurehasBeenCreatedBeforeMay

  const compulsory = new Date().getTime() >= new Date('2024-09-01').getTime()

  return {
    shouldFillDPO,
    compulsory
  }
}

export const getStructureDPOStatus = createQuery({
  handler,
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
