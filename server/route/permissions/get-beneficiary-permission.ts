import { beneficiaryRule } from './rules'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security'
import { createQuery } from '~/server/route'
import { GetPermissionsInput, getPermissionsSchema } from '~/server/schema'
import { getBeneficiarySecurityTarget } from '~/server/query'

export type BeneficiaryPermissions = {
  helpRequest: {
    create: boolean
    view: boolean
    viewDetails: boolean
    list: boolean
  }
  // fields: {
  //   ministereCategorie: boolean
  //   ministereStructure: boolean
  //   ministereDepartementServiceAc: boolean
  // }
}

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: GetPermissionsInput
}) => {
  const { user } = ctx

  const beneficiary = await getBeneficiarySecurityTarget(
    user,
    input.beneficiaryId
  )

  const permissions: BeneficiaryPermissions = {
    helpRequest: {
      create: beneficiaryRule.canCreateHelpRequest(user, beneficiary),
      view: beneficiaryRule.canViewHelpRequest(user, beneficiary),
      viewDetails: beneficiaryRule.canViewHelpRequestDetails(user, beneficiary),
      list: beneficiaryRule.canListBeneficiaryHelpRequests(user, beneficiary)
    }
  }

  return Promise.resolve(permissions)
}

export const getBeneficiaryPermissions = createQuery({
  inputValidation: getPermissionsSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
