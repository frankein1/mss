import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import {
  BeneficiaryPermissions,
  SecurityRuleGrantee,
  getBeneficiaryPermissions
} from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import {
  getBeneficiarySecurityTarget,
  getStructureByUser
} from '~/server/query'
import {
  UpdateBeneficiaryOccupationInput,
  updateBeneficiaryOccupationSchema
} from '~/server/schema'
import { BeneficiaryRepo } from '~/server/database'
import { prepareRelationUpdates } from '~/utils/prisma'

function getBeneficiaryWithIncomes(user: SecurityRuleGrantee, id: string) {
  return BeneficiaryRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      id: true,
      incomes: true
    }
  })
}

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: UpdateBeneficiaryOccupationInput
) => {
  const target = await getBeneficiarySecurityTarget(user, input.id)
  const structure = await getStructureByUser(user)
  const permissions = getBeneficiaryPermissions({
    user,
    structure,
    target
  })
  return permissions.edit.occupationIncome
}

const handler = async ({
  input,
  ctx: { user, structure }
}: {
  input: UpdateBeneficiaryOccupationInput
  ctx: ProtectedAppContext
}) => {
  const target = await getBeneficiarySecurityTarget(user, input.id)
  const permissions = getBeneficiaryPermissions({ user, structure, target })
  const data = filterInput({ input, permissions })

  const beneficiary = await getBeneficiaryWithIncomes(user, input.id)
  const previousIncomes = beneficiary.incomes.map(income => ({
    ...income,
    incomeAmount: income.incomeAmount?.toNumber()
  }))
  const incomesRelationUpdates = prepareRelationUpdates(
    input.incomes || [],
    previousIncomes
  )

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    where: { id: input.id },
    data: {
      ...data,
      incomes: incomesRelationUpdates
    }
  })

  return updatedBeneficiary
}

export const updateOccupationIncomeMutation = createMutation({
  inputValidation: updateBeneficiaryOccupationSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.updateOccupationIncome',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})

function filterInput({
  input,
  permissions
}: {
  input: UpdateBeneficiaryOccupationInput
  permissions: BeneficiaryPermissions
}) {
  const { set } = permissions
  const { id: _id, ...data } = input
  if (!set.ministereCategorie) {
    delete data.ministereCategorie
  }
  if (!set.ministereDepartementServiceAc) {
    delete data.ministereDepartementServiceAc
  }
  if (!set.ministereStructure) {
    delete data.ministereStructure
  }
  return data
}
