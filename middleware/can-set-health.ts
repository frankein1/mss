import { canEditBeneficiaryHealthInfo } from '~/server/security/rules'
import { beneficiaryFormSectionMiddleware } from '~/utils/routing'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const beneficiaryId = to.params.id as string | undefined

  return await beneficiaryFormSectionMiddleware(
    beneficiaryId,
    to.path,
    from.path,
    canEditBeneficiaryHealthInfo
  )
})
