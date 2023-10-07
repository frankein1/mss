import { beneficiaryFormSectionMiddleware } from '~/utils/routing'
import { canEditBeneficiaryRelatives } from '~/server/security/rules'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const beneficiaryId = to.params.id as string | undefined

  return await beneficiaryFormSectionMiddleware(
    beneficiaryId,
    to.path,
    from.path,
    canEditBeneficiaryRelatives
  )
})
