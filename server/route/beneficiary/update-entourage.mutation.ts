import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { SecurityRuleContext, SecurityRuleGrantee } from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import {
  UpdateBeneficiaryEntourageInput,
  updateBeneficiaryEntourageSchema
} from '~/server/schema'
import { prepareRelationUpdates } from '~/utils/prisma'
import { BeneficiaryRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'

function getBeneficiarySecurityTargetWithEntourage(
  user: SecurityRuleGrantee,
  id: string
) {
  return BeneficiaryRepo.findWithNoDraftCondition(user, {
    where: { id },
    select: {
      id: true,
      structureId: true,
      familyFile: {
        select: {
          referents: {
            select: { id: true, role: true, structureId: true }
          }
        }
      },
      relatives: true
    }
  })
}

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateBeneficiaryEntourageInput
) => {
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.id
  )
  return permissions.edit.relatives
}

const handler = async ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryEntourageInput
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTargetWithEntourage(
    user,
    input.id
  )

  const { id, entourages } = input

  const { relatives: previousRelatives } = beneficiary

  const newEntourages =
    entourages?.filter(e =>
      // Does not save empty relative
      Object.entries(e).some(([key, value]) => key !== 'id' && !!value)
    ) || []

  const entouragesRelationUpdates = prepareRelationUpdates(
    newEntourages,
    previousRelatives
  )

  const data = { relatives: entouragesRelationUpdates }

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id },
    data
  })

  return updatedBeneficiary
}

export const updateEntourageMutation = createMutation({
  inputValidation: updateBeneficiaryEntourageSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.updateEntourage',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
